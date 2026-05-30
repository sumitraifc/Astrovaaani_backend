const repo = require("./repository");

exports.getDetails = async (id) => {
  return await repo.getByAstrologerId(id);
};

const repo = require("./repository");

exports.updateDetails = async (id, payload) => {
  if (!id) {
    throw new Error("Astrologer ID required");
  }

  if (!payload.account_number || !payload.ifsc_code) {
    throw new Error("Required bank details missing");
  }

  if (payload.account_number !== payload.confirm_account_number) {
    throw new Error("Account number mismatch");
  }

  // clean data
  const updateData = {
    account_holder: payload.account_holder,
    bank_name: payload.bank_name,
    account_number: payload.account_number,
    ifsc_code: payload.ifsc_code,
    branch_name: payload.branch_name || null,
    upi_id: payload.upi_id || null,
  };

  await repo.update(id, updateData);

  return {
    success: true,
    message: "Bank details updated successfully",
  };
};