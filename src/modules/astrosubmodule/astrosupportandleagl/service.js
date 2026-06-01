const repo = require("./repository");

exports.getContent = async (astrologerId) => {
  return await repo.getContent(astrologerId);
};