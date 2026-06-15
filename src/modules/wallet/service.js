const axios = require("axios");
const repo = require("./repository");
const userRepo = require("../user/repository");
const cashfree = require("../../config/cashfree");

exports.getWallet = async (userId) => {
  const wallet = await repo.getWallet(userId);

  return {
    success: true,
    wallet
  };
};

// exports.getTransactions = async (userId) => {
//   const transactions = await repo.getTransactions(userId);

//   return {
//     success: true,
//     transactions
//   };
// };
exports.getTransactions = async (userId, type) => {
  const transactions = await repo.getTransactions(userId, type);

  return {
    success: true,
    total: transactions.length,
    data: transactions
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

exports.createPaymentOrder = async (userId, amount) => {
  const parsedAmount = parseFloat(amount);

  if (!parsedAmount || parsedAmount <= 0) {
    throw new Error("Amount must be a positive number");
  }

  const user = await userRepo.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
  const customerPhone = String(user.mobile || user.phoneNumber || "");
  const customerEmail = user.email || "";
  const customerName = user.name || user.full_name || "";

  const data = {
    order_id: orderId,
    order_amount: parsedAmount,
    order_currency: "INR",
    customer_details: {
      customer_id: `USER_${user.id}`,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      customer_name: customerName
    },
    order_meta: {
      notify_url: cashfree.notifyUrl
    },
    payment_methods: "upi_intent"
  };

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-api-version": "2023-08-01",
    "x-client-id": cashfree.apiKey,
    "x-client-secret": cashfree.secretKey
  };

  const response = await axios.post(cashfree.baseUrl, data, { headers });
  const responseData = response.data;

  const wallet = await repo.getWallet(userId);
  const balanceBefore = wallet?.balance || 0;

  await repo.addCashfreeTransaction({
    user_id: userId,
    type: "credit",
    amount: parsedAmount,
    reason: "Wallet recharge via Cashfree",
    payment_method: "cashfree",
    payment_ref: orderId,
    status: "pending",
    balance_before: balanceBefore,
    balance_after: balanceBefore
  });

  return {
    success: true,
    message: "Payment order created successfully",
    data: responseData
  };
};

exports.handleCashfreeCallback = async (payload) => {
  console.log('[handleCashfreeCallback] start', { time: new Date().toISOString(), payload });

  const orderId = payload.order_id || payload.reference_id;
  const orderStatus = (payload.order_status || payload.tx_status || payload.status || "").toUpperCase();

  console.log('[handleCashfreeCallback] parsed', { orderId, orderStatus });

  if (!orderId) {
    console.error('[handleCashfreeCallback] missing order_id', payload);
    throw new Error("Missing order_id in callback payload");
  }

  console.log('[handleCashfreeCallback] looking up transaction for', orderId);
  const transaction = await repo.getTransactionByPaymentRef(orderId);
  console.log('[handleCashfreeCallback] transaction found', transaction);
  if (!transaction) {
    console.error('[handleCashfreeCallback] pending transaction not found for', orderId);
    throw new Error("Pending payment transaction not found");
  }

  if (transaction.status === "completed") {
    console.log('[handleCashfreeCallback] transaction already completed', transaction.id);
    return {
      success: true,
      message: "Transaction already completed"
    };
  }

  const isSuccess = ["PAID", "SUCCESS", "SUCCESSFUL", "COMPLETED"].includes(orderStatus);
  const paymentRef = payload.payment_id || payload.tx_id || orderId;

  if (isSuccess) {
    console.log('[handleCashfreeCallback] marking success, updating balance for user', transaction.user_id, 'amount', transaction.amount);
    await repo.updateBalance(transaction.user_id, transaction.amount);

    const wallet = await repo.getWallet(transaction.user_id);
    const balanceAfter = wallet?.balance || transaction.balance_before + transaction.amount;

    console.log('[handleCashfreeCallback] updating transaction status to completed', { transactionId: transaction.id, paymentRef, balanceAfter });
    await repo.updateTransactionStatus(transaction.id, "completed", paymentRef, balanceAfter);

    return {
      success: true,
      message: "Payment verified and wallet updated",
      data: {
        order_id: orderId,
        amount: transaction.amount,
        balance_after: balanceAfter
      }
    };
  }

  console.log('[handleCashfreeCallback] marking failed for transaction', transaction.id);
  await repo.updateTransactionStatus(transaction.id, "failed", paymentRef, transaction.balance_before);

  return {
      success: true,
      message: "Payment failed or pending",
      status: orderStatus
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