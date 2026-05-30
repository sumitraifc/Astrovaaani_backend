const repo = require("./repository");

exports.getDetails = async (id) => {
  return await repo.getByAstrologerId(id);
};

exports.updateDetails = async (id, payload) => {

  if (
    payload.account_number !==
    payload.confirm_account_number
  ) {
    throw new Error("Account number mismatch");
  }

  await repo.update(id, {
    account_holder: payload.account_holder,
    bank_name: payload.bank_name,
    account_number: payload.account_number,
    ifsc_code: payload.ifsc_code,
    branch_name: payload.branch_name,
    upi_id: payload.upi_id
  });

  return {
    success: true,
    message: "Bank details updated"
  };
};