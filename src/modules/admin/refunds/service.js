const repo = require('./repository');
exports.getAll  = (q)              => repo.getAll(q);
exports.approve = (id, adminId)    => repo.approve(id, adminId);
exports.reject  = (id, note, adminId) => repo.reject(id, note, adminId);
