const repo = require('./repository');

exports.getList = (q)   => repo.getList(q);
exports.approve = (id)  => repo.updateStatus(id, 'published');
exports.reject  = (id)  => repo.updateStatus(id, 'rejected');
