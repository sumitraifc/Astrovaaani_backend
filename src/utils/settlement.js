const db = require("../config/db");

async function getAstrologerCommissionPercent(astrologerId) {
  const [rows] = await db.query(
    `SELECT commission_percent FROM astrologers WHERE id = ? LIMIT 1`,
    [Number(astrologerId)]
  );
  return Number(rows[0]?.commission_percent || 0);
}

async function settleConsultationCharge({
  user_id,
  astrologer_id,
  amount,
  sessionType,
  sessionId,
  reason = "Consultation Charge"
}) {
  const commissionPercent = await getAstrologerCommissionPercent(astrologer_id);
  const adminCut = Number(((amount * commissionPercent) / 100).toFixed(2));
  const astrologerNet = Number((amount - adminCut).toFixed(2));

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [walletUpdate] = await connection.query(
      `UPDATE wallet SET balance = balance - ? WHERE user_id = ? AND balance >= ?`,
      [amount, Number(user_id), amount]
    );

    if (walletUpdate.affectedRows === 0) {
      await connection.rollback();
      return { success: false, reason: "insufficient_balance" };
    }

    await connection.query(
      `INSERT INTO wallet_transactions (user_id, type, amount, reason, created_at) VALUES (?, 'debit', ?, ?, NOW())`,
      [Number(user_id), amount, reason]
    );

    await connection.query(
      `UPDATE astrologers
       SET wallet_balance = COALESCE(wallet_balance, 0) + ?,
           total_earnings = COALESCE(total_earnings, 0) + ?
       WHERE id = ?`,
      [astrologerNet, astrologerNet, Number(astrologer_id)]
    );

    if (sessionType === "chat") {
      await connection.query(
        `UPDATE chat_conversations
         SET admin_commission = ?, updated_at = NOW()
         WHERE conversation_id = ?`,
        [commissionPercent, sessionId]
      );
    } else if (sessionType === "call") {
      await connection.query(
        `UPDATE call_history
         SET admin_commission_percent = ?, updated_at = NOW()
         WHERE id = ?`,
        [commissionPercent, Number(sessionId)]
      );
    }

    await connection.query(
      `UPDATE orders SET price = COALESCE(price, 0) + ? WHERE conversation_id = ?`,
      [amount, String(sessionId)]
    );

    await connection.commit();
    return {
      success: true,
      adminCut,
      astrologerNet,
      commissionPercent
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  settleConsultationCharge
};
