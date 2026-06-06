const repo = require('./repository');
exports.getAll = ()       => repo.getAll();
exports.upsert = (data)   => repo.upsert(data);
