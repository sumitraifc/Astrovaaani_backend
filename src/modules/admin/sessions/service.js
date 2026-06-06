const repo = require('./repository');
exports.getSessions = (q)        => repo.getSessions(q);
exports.getById    = (type, id)  => repo.getById({ type, id });
exports.getStats   = ()          => repo.getStats();
