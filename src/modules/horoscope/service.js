const repo = require("./repository");

exports.getZodiacs = async () => {
  return await repo.getZodiacs();
};

exports.getHoroscope = async (zodiacId, type) => {
  return await repo.getHoroscope(zodiacId, type);
};

exports.getById = async (id) => {
  return await repo.getById(id);
};

exports.create = async (data) => {
  return await repo.create(data);
};

exports.update = async (id, data) => {
  return await repo.update(id, data);
};