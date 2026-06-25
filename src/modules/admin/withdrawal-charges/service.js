const repo = require('./repository');

exports.get    = () => repo.get();
exports.update = (data) => repo.update(data);
