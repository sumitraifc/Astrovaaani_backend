const pool = require('../../../config/db');

const generateTicketId = () => `TKT${Date.now().toString().slice(-8)}`;

exports.getAll = async ({ search, status, raisedBy, page, limit }) => {
  const offset = (page - 1) * limit;
  let where = 'WHERE 1=1';
  const params = [];

  if (status && status !== 'all')   { where += ' AND st.status = ?';     params.push(status); }
  if (raisedBy && raisedBy !== 'all') { where += ' AND st.raised_by = ?'; params.push(raisedBy); }
  if (search) {
    where += ' AND (st.ticket_id LIKE ? OR st.user_name LIKE ? OR st.issue LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s, s);
  }

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM support_tickets st ${where}`, params
  );

  const [rows] = await pool.query(`
    SELECT st.id, st.ticket_id, st.raised_by, st.user_name, st.user_phone,
      st.user_email, st.issue, st.category, st.priority, st.status,
      st.admin_comment, st.created_at, st.updated_at
    FROM support_tickets st
    ${where}
    ORDER BY st.created_at DESC LIMIT ? OFFSET ?
  `, [...params, limit, offset]);

  return { total, data: rows };
};

exports.getById = async (id) => {
  const [[ticket]] = await pool.query(
    'SELECT * FROM support_tickets WHERE id = ?', [id]
  );
  if (!ticket) return null;

  // fetch messages with attachments
  const [messages] = await pool.query(`
    SELECT m.id, m.from_type AS \`from\`, m.sender_name AS senderName,
      m.message AS text, m.sent_at AS time
    FROM support_ticket_messages m
    WHERE m.ticket_id = ? ORDER BY m.sent_at ASC
  `, [id]);

  for (const msg of messages) {
    const [attachments] = await pool.query(
      'SELECT file_url AS url, file_name AS name, file_type AS type FROM support_ticket_attachments WHERE message_id = ?',
      [msg.id]
    );
    msg.attachments = attachments;
  }

  // build timeline from status history (derive from messages + current status)
  const timeline = [
    { event: `Ticket raised by ${ticket.raised_by}`, time: ticket.created_at, type: 'created' },
  ];
  if (ticket.status === 'in_review' || ticket.status === 'resolved' || ticket.status === 'rejected') {
    timeline.push({ event: 'Ticket reviewed by Admin', time: ticket.updated_at, type: 'review' });
  }
  if (ticket.status === 'resolved') {
    timeline.push({ event: 'Ticket resolved by Admin', time: ticket.updated_at, type: 'resolved' });
  }
  if (ticket.status === 'rejected') {
    timeline.push({ event: 'Ticket rejected by Admin', time: ticket.updated_at, type: 'rejected' });
  }

  return { ...ticket, messages, timeline };
};

exports.updateStatus = async (id, status, adminComment) => {
  await pool.query(
    'UPDATE support_tickets SET status = ?, admin_comment = ?, updated_at = NOW() WHERE id = ?',
    [status, adminComment || null, id]
  );
};

exports.addMessage = async (ticketId, fromType, senderName, message) => {
  const [result] = await pool.query(
    'INSERT INTO support_ticket_messages (ticket_id, from_type, sender_name, message) VALUES (?,?,?,?)',
    [ticketId, fromType, senderName, message]
  );
  await pool.query('UPDATE support_tickets SET updated_at = NOW() WHERE id = ?', [ticketId]);
  return result.insertId;
};

exports.addAttachment = async (messageId, ticketId, fileUrl, fileName, fileType) => {
  await pool.query(
    'INSERT INTO support_ticket_attachments (message_id, ticket_id, file_url, file_name, file_type) VALUES (?,?,?,?,?)',
    [messageId, ticketId, fileUrl, fileName, fileType]
  );
};

exports.getStats = async () => {
  const [[stats]] = await pool.query(`
    SELECT
      SUM(CASE WHEN status = 'open'      THEN 1 ELSE 0 END) AS open_count,
      SUM(CASE WHEN status = 'in_review' THEN 1 ELSE 0 END) AS review_count,
      SUM(CASE WHEN status = 'resolved'  THEN 1 ELSE 0 END) AS resolved_count,
      SUM(CASE WHEN status = 'rejected'  THEN 1 ELSE 0 END) AS rejected_count,
      COUNT(*) AS total
    FROM support_tickets
  `);
  return stats;
};
