const repo = require('./repository');

exports.getStats          = () => repo.getStats();
exports.getRevenueChart   = () => repo.getRevenueChart();
exports.getRecentSessions = () => repo.getRecentSessions();
