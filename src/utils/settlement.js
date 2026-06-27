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
  console.log(`\n[SETTLEMENT] Starting settlement: user=${user_id}, astrologer=${astrologer_id}, amount=${amount}, type=${sessionType}, sessionId=${sessionId}`);
  
  const commissionPercent = await getAstrologerCommissionPercent(astrologer_id);
  const adminCut = Number(((amount * commissionPercent) / 100).toFixed(2));
  const astrologerNet = Number((amount - adminCut).toFixed(2));

  console.log(`[SETTLEMENT] Commission: ${commissionPercent}%, Admin cut: ${adminCut}, Astrologer net: ${astrologerNet}`);

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [walletUpdate] = await connection.query(
      `UPDATE wallet SET balance = balance - ? WHERE user_id = ? AND balance >= ?`,
      [amount, Number(user_id), amount]
    );

    console.log(`[SETTLEMENT] Wallet update result:`, walletUpdate);

    if (walletUpdate.affectedRows === 0) {
      await connection.rollback();
      console.log(`[SETTLEMENT] ❌ Insufficient balance for user ${user_id}`);
      return { success: false, reason: "insufficient_balance" };
    }

    await connection.query(
      `INSERT INTO wallet_transactions (user_id, type, amount, reason, created_at) VALUES (?, 'debit', ?, ?, NOW())`,
      [Number(user_id), amount, reason]
    );

    console.log(`[SETTLEMENT] ✅ Wallet transaction recorded`);

    await connection.query(
      `UPDATE astrologers
       SET wallet_balance = COALESCE(wallet_balance, 0) + ?,
           total_earnings = COALESCE(total_earnings, 0) + ?
       WHERE id = ?`,
      [astrologerNet, astrologerNet, Number(astrologer_id)]
    );

    console.log(`[SETTLEMENT] ✅ Astrologer wallet updated`);

    if (sessionType === "chat") {
      const [chatUpdate] = await connection.query(
        `UPDATE chat_conversations
         SET admin_commission = ?
         WHERE conversation_id = ?`,
        [commissionPercent, sessionId]
      );
      console.log(`[SETTLEMENT] Chat conversation update:`, chatUpdate);
    } else if (sessionType === "call") {
      const [callUpdate] = await connection.query(
        `UPDATE call_history
         SET admin_commission_percent = ?
         WHERE id = ?`,
        [commissionPercent, Number(sessionId)]
      );
      console.log(`[SETTLEMENT] Call history update:`, callUpdate);
      
    }

    // NOTE: Do NOT update `orders` here per-minute; orders should record final total
    // Order price will be set once the session ends (chat or call). Commit transaction.
    await connection.commit();
    console.log(`[SETTLEMENT] ✅ Settlement completed successfully`);
    
    return {
      success: true,
      adminCut,
      astrologerNet,
      commissionPercent
    };
  } catch (error) {
    await connection.rollback();
    console.error(`[SETTLEMENT] ❌ Error:`, error.message);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  settleConsultationCharge
};
