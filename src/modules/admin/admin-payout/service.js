const repo = require('./repository');

exports.getProfile       = (adminId)        => repo.getProfile(adminId);
exports.updateBankDetails= (adminId, data)  => repo.updateBankDetails(adminId, data);
exports.getPayoutHistory = (adminId, q)     => repo.getPayoutHistory(adminId, q);
exports.requestPayout    = (adminId, data)  => repo.requestPayout(adminId, data);
