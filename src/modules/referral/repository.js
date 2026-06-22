const db = require("../../config/db");
exports.getStats = async (astrologerId) => {

    const [rows] = await db.query(`
        SELECT
        referral_code,
        total_referrals,
        active_referrals,
        referral_bonus_earned
        FROM astrologers
        WHERE id=?
    `,[astrologerId]);

    return rows[0];
};

exports.getHistory = async (astrologerId) => {

    const [rows] = await db.query(`
        SELECT
            a.id,
            a.name,
            a.profile_image,
            a.approval_status,
            h.status,
            h.bonus_amount,
            h.created_at
        FROM referral_histories h
        JOIN astrologers a
            ON a.id = h.referred_astrologer_id
        WHERE h.referrer_id = ?
        ORDER BY h.id DESC
    `,[astrologerId]);

    return rows;
};