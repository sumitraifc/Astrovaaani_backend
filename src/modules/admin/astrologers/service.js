const repo = require('./repository');

exports.getList       = (q) => repo.getList(q);
exports.getById       = (id) => repo.getById(id);
exports.updateStepStatus = (id, step, status, remark, adminId) =>
  repo.updateStepStatus(id, step, status, remark, adminId);
exports.block         = (id) => repo.updateStatus(id, 'blocked');
exports.unblock       = (id) => repo.updateStatus(id, 'active');
exports.delete        = (id) => repo.delete(id);
exports.updateCommission = (id, commission) => repo.updateCommission(id, commission);
