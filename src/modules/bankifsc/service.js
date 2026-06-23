const Repository = require("./repository");

exports.getBankIfsc = async (ifsc) => {
  const data = await Repository.getBankIfsc(ifsc);

  return {
    bank_name: data.BANK,
    branch_name: data.BRANCH,
    ifsc: data.IFSC,
    city: data.CITY,
    district: data.DISTRICT,
    state: data.STATE,
    address: data.ADDRESS
  };
};