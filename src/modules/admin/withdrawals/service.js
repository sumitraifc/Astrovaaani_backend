const repo = require('./repository');

exports.getList   = (q)              => repo.getList(q);
exports.approve   = (id, adminId, utr)  => repo.approve(id, adminId, utr);
exports.reject    = (id, adminId, note) => repo.reject(id, adminId, note);
