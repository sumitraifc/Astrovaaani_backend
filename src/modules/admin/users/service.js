const repo = require('./repository');

exports.getAll     = (q) => repo.getAll(q);
exports.getById    = (id) => repo.getById(id);
exports.block      = (id) => repo.updateStatus(id, 'blocked');
exports.unblock    = (id) => repo.updateStatus(id, 'active');
exports.delete     = (id) => repo.delete(id);
exports.addWallet  = (id, amount, note) => repo.addWallet(id, amount, note);
