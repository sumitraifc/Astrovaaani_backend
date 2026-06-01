const repo = require("./repository");

exports.getHome = async (astrologerId) => {
  return await repo.getHome(astrologerId);
};