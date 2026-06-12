const repo = require("./repository");

// dynamic charges (TDS + processing)
function calculateCharges(amount, charges) {
  const tds = (amount * charges.tds_percent) / 100;

  const processing =
    (amount * charges.processing_percent) / 100 +
    Number(charges.fixed_processing_fee || 0);

  return {
    tds,
    processing,
    totalDeduction: tds + processing,
    payableAmount: amount - (tds + processing),
  };
}

/**
 * WALLET INFO
 */
exports.getWalletInfo = async (astrologer_id) => {
  const astro = await repo.getAstrologer(astrologer_id);
  const withdrawn = await repo.totalWithdrawn(astrologer_id);

  return {
    status: true,
    data: {
      total_earnings: astro.total_earnings,
      wallet_balance: astro.wallet_balance,
      total_withdrawn: withdrawn,
    },
  };
};

/**
 * EARNING HISTORY
 */
exports.getEarningHistory = async (astrologer_id) => {
  const data = await repo.getEarningHistory(astrologer_id);
  return { status: true, data };
};

/**
 * WITHDRAW REQUEST
 */
exports.requestWithdraw = async (astrologer_id, body) => {
  const { amount } = body;

  const astro = await repo.getAstrologer(astrologer_id);

  if (!astro) {
    return { status: false, message: "Astrologer not found" };
  }

  if (amount > astro.wallet_balance) {
    return { status: false, message: "Insufficient balance" };
  }

  // ✅ charges
  const charges = await repo.getCharges();
  const calc = calculateCharges(amount, charges);

  // ✅ wallet update
  const newBalance = astro.wallet_balance - amount;
  await repo.updateWallet(astrologer_id, newBalance);

  // ✅ withdraw request (NO bank data needed)
  const result = await repo.createWithdraw({
    astrologer_id,
    amount,
    method: astro.bank_name ? "bank" : "upi",
    utr_number: null
  });

  return {
    status: true,
    message: "Withdrawal request submitted",
    data: {
      requested_amount: amount,
      bank_name: astro.bank_name,
      account_number: astro.account_number,
      ifsc_code: astro.ifsc_code,
      upi_id: astro.upi_id,
      ...calc,
      new_wallet_balance: newBalance,
      withdrawal_id: result.insertId
    }
  };
};

/**
 * WITHDRAW HISTORY
 */
exports.getWithdrawHistory = async (astrologer_id) => {
  const data = await repo.getWithdrawHistory(astrologer_id);
  return { status: true, data };
};