const axios = require("axios");

exports.getBankIfsc = async (ifsc) => {
  try {
    const { data } = await axios.get(
      `https://ifsc.razorpay.com/${ifsc}`
    );

    return data;
  } catch (error) {
    throw new Error("Invalid IFSC code");
  }
};