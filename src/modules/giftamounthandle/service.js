const Repository = require("./repository");

exports.getList = async () => {
  return await Repository.getList();
};