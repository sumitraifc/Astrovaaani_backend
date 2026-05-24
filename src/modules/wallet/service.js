const repo = require("./repository");

exports.getWallet = async (userId) => {
  const wallet = await repo.getWallet(userId);

  return {
    success: true,
    wallet
  };
};

exports.getTransactions = async (userId) => {
  const transactions = await repo.getTransactions(userId);

  return {
    success: true,
    transactions
  };
};

exports.addMoney = async (userId, amount) => {
  await repo.updateBalance(userId, amount);

  await repo.addTransaction({
    user_id: userId,
    type: "credit",
    amount,
    reason: "Wallet recharge"
  });

  return {
    success: true,
    message: "Money added"
  };
};

exports.spendMoney = async (userId, amount) => {
  await repo.updateBalance(userId, -amount);

  await repo.addTransaction({
    user_id: userId,
    type: "debit",
    amount,
    reason: "Consultation"
  });

  return {
    success: true,
    message: "Money spent"
  };
};

exports.refundMoney = async (userId, amount) => {
  await repo.updateBalance(userId, amount);

  await repo.addTransaction({
    user_id: userId,
    type: "refund",
    amount,
    reason: "Refund"
  });

  return {
    success: true,
    message: "Refund added"
  };
};