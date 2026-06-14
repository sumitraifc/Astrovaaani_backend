const repo = require("./repository");

exports.getContent = async () => {
  return await repo.getContent();
};