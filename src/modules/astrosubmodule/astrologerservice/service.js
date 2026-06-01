const repo = require("./repository");

exports.getService = async (astrologerId) => {
  return await repo.getService(astrologerId);
};

exports.updateService = async (astrologerId, data) => {
  return await repo.updateService(astrologerId, data);
};