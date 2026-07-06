const db = require("../../config/db");

/**
 * Generate Ticket ID
 */
exports.generateTicketId = async () => {
    try {
        const [rows] = await db.query(
            `SELECT COUNT(*) AS total FROM support_tickets`
        );

        const next = Number(rows[0].total) + 1;
        return `TKT${String(next).padStart(6, "0")}`;

    } catch (error) {
        throw error;
    }
};

/**
 * Create Ticket
 */
exports.createTicket = async (data) => {
    try {

        const sql = `
            INSERT INTO support_tickets
            (
                ticket_id,
                raised_by,
                user_id,
                astrologer_id,
                user_name,
                user_phone,
                user_email,
                issue,
                description,
                category,
                priority,
                status
            )
            VALUES
            (
                ?,?,?,?,?,?,?,?,?,?,?,?
            )
        `;

        const [result] = await db.query(sql, [
            data.ticket_id,
            data.raised_by,
            data.user_id,
            data.astrologer_id,
            data.user_name,
            data.user_phone,
            data.user_email,
            data.issue,
            data.description,
            data.category,
            data.priority,
            "open"
        ]);

        return result;

    } catch (error) {
        throw error;
    }
};

/**
 * Get Ticket By ID
 */
exports.getTicketById = async (id) => {

    try {

        const [rows] = await db.query(
            `SELECT * FROM support_tickets
            WHERE id=?
            LIMIT 1`,
            [id]
        );

        return rows[0] || null;

    } catch (error) {
        throw error;
    }

};

/**
 * Get Ticket By Ticket Number
 */
exports.getTicketByTicketId = async (ticket_id) => {

    try {

        const [rows] = await db.query(
            `SELECT *
             FROM support_tickets
             WHERE ticket_id=?
             LIMIT 1`,
            [ticket_id]
        );

        return rows[0] || null;

    } catch (error) {
        throw error;
    }

};

/**
 * Insert First Message
 */
exports.createMessage = async (data) => {

    try {

        const sql = `
            INSERT INTO support_ticket_messages
            (
                ticket_id,
                from_type,
                sender_name,
                message
            )
            VALUES
            (
                ?,?,?,?
            )
        `;

        const [result] = await db.query(sql, [

            data.ticket_id,
            data.from_type,
            data.sender_name,
            data.message

        ]);

        return result;

    } catch (error) {
        throw error;
    }

};

/**
 * Save Attachments
 */
exports.saveAttachment = async (data) => {

    try {

        const sql = `
            INSERT INTO support_ticket_attachments
            (
                message_id,
                ticket_id,
                file_url,
                file_name,
                file_type
            )
            VALUES
            (
                ?,?,?,?,?
            )
        `;

        const [result] = await db.query(sql, [

            data.message_id,
            data.ticket_id,
            data.file_url,
            data.file_name,
            data.file_type

        ]);

        return result;

    } catch (error) {
        throw error;
    }

};

/**
 * Ticket List
 */
exports.getTickets = async (
    raised_by,
    user_id,
    astrologer_id,
    status,
    limit,
    offset
) => {

    try {

        let sql = `
            SELECT *
            FROM support_tickets
            WHERE raised_by=?
        `;

        const params = [raised_by];

        if (raised_by === "user") {
            sql += ` AND user_id=?`;
            params.push(user_id);
        }

        if (raised_by === "astrologer") {
            sql += ` AND astrologer_id=?`;
            params.push(astrologer_id);
        }

        if (status) {
            sql += ` AND status=?`;
            params.push(status);
        }

        sql += `
            ORDER BY id DESC
            LIMIT ?
            OFFSET ?
        `;

        params.push(limit);
        params.push(offset);

        const [rows] = await db.query(sql, params);

        return rows;

    } catch (error) {
        throw error;
    }

};

/**
 * Total Ticket Count
 */
exports.getTicketCount = async (
    raised_by,
    user_id,
    astrologer_id,
    status
) => {

    try {

        let sql = `
            SELECT COUNT(*) total
            FROM support_tickets
            WHERE raised_by=?
        `;

        const params = [raised_by];

        if (raised_by === "user") {

            sql += ` AND user_id=?`;
            params.push(user_id);

        }

        if (raised_by === "astrologer") {

            sql += ` AND astrologer_id=?`;
            params.push(astrologer_id);

        }

        if (status) {

            sql += ` AND status=?`;
            params.push(status);

        }

        const [rows] = await db.query(sql, params);

        return rows[0].total;

    } catch (error) {
        throw error;
    }

};

/**
 * Messages
 */
exports.getMessages = async (ticket_id) => {

    try {

        const sql = `
            SELECT
                m.*,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id',a.id,
                            'file_url',a.file_url,
                            'file_name',a.file_name,
                            'file_type',a.file_type
                        )
                    )
                    FROM support_ticket_attachments a
                    WHERE a.message_id=m.id
                ) attachments
            FROM support_ticket_messages m
            WHERE m.ticket_id=?
            ORDER BY m.id ASC
        `;

        const [rows] = await db.query(sql, [ticket_id]);

        return rows;

    } catch (error) {
        throw error;
    }

};

/**
 * Reply Ticket
 */
exports.replyTicket = async (data) => {

    try {

        const sql = `
            INSERT INTO support_ticket_messages
            (
                ticket_id,
                from_type,
                sender_name,
                message
            )
            VALUES
            (
                ?,?,?,?
            )
        `;

        const [result] = await db.query(sql, [

            data.ticket_id,
            data.from_type,
            data.sender_name,
            data.message

        ]);

        return result;

    } catch (error) {
        throw error;
    }

};

/**
 * Update Status
 */
exports.updateStatus = async (ticket_id, status) => {

    try {

        const [result] = await db.query(
            `UPDATE support_tickets
             SET status=?
             WHERE id=?`,
            [status, ticket_id]
        );

        return result;

    } catch (error) {
        throw error;
    }

};

/**
 * Attachments By Ticket
 */
exports.getAttachments = async (ticket_id) => {

    try {

        const [rows] = await db.query(
            `SELECT *
             FROM support_ticket_attachments
             WHERE ticket_id=?`,
            [ticket_id]
        );

        return rows;

    } catch (error) {
        throw error;
    }

};

/**
 * Delete Attachment
 */
exports.deleteAttachment = async (id) => {

    try {

        const [result] = await db.query(
            `DELETE
             FROM support_ticket_attachments
             WHERE id=?`,
            [id]
        );

        return result;

    } catch (error) {
        throw error;
    }

};