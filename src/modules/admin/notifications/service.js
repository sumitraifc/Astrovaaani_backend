const repo = require('./repository');
exports.send       = (data) => repo.send(data);
exports.getHistory = (q)    => repo.getHistory(q);
