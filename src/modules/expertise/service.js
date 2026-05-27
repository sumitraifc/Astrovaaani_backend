const repo = require("./repository");

exports.getAll = async () => {

  const data = await repo.getAll();

  return {
    success: true,
    total: data.length,
    data
  };
};