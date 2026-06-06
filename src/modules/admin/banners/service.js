const repo = require('./repository');
exports.getAll = ()           => repo.getAll();
exports.create = (data)       => repo.create(data);
exports.update = (id, data)   => repo.update(id, data);
exports.delete = (id)         => repo.delete(id);
