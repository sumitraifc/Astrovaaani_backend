const env = process.env;

const mode = env.CASHFREE_ENVIRONMENT || "sandbox";
const host = mode === "production"
  ? "https://api.cashfree.com/pg"
  : "https://sandbox.cashfree.com/pg";

module.exports = {
  apiKey: env.CASHFREE_API_KEY || "TEST10256948ec57a943389eb31e588f84965201",
  secretKey: env.CASHFREE_SECRET_KEY || "cfsk_ma_test_4bf75f253a8b0b51dd9252a617bec825_4076da95",
  notifyUrl: env.CASHFREE_NOTIFY_URL || "https://root.astrovaaani.com/api/wallet/cashfree-callback",
  // notifyUrl: env.CASHFREE_NOTIFY_URL || "https://astorvani.codescarts.com/api/wallet/cashfree-callback",
  mode,
  baseUrl: `${host}/orders`
};
