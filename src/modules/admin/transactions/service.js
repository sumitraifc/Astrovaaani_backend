const repo = require('./repository');
exports.getUserTransactions       = (q)             => repo.getUserTransactions(q);
exports.getAstrologerTransactions = (q)             => repo.getAstrologerTransactions(q);
exports.addUserAmount             = (id, amt, note) => repo.addUserAmount(id, amt, note);
exports.addAstrologerAmount       = (id, amt, note) => repo.addAstrologerAmount(id, amt, note);
