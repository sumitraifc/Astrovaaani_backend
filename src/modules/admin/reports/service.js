const repo = require('./repository');

exports.getAll    = (q)       => repo.getAll(q);
exports.getById   = (id)      => repo.getById(id);
exports.getStats  = ()        => repo.getStats();
exports.takeAction = (id, body) => repo.takeAction(id, body);
