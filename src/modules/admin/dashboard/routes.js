const router = require('express').Router();
const ctrl   = require('./controller');
const adminAuth = require('../../../middlewares/adminAuth');

router.get('/stats',           adminAuth, ctrl.getStats);
router.get('/revenue-chart',   adminAuth, ctrl.getRevenueChart);
router.get('/recent-sessions', adminAuth, ctrl.getRecentSessions);

module.exports = router;
