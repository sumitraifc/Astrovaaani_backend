const router    = require('express').Router();
const ctrl      = require('./controller');
const adminAuth = require('../../../middlewares/adminAuth');

router.get('/users',        adminAuth, ctrl.getUserTransactions);
router.get('/astrologers',  adminAuth, ctrl.getAstrologerTransactions);
router.post('/add-user',    adminAuth, ctrl.addUserAmount);
router.post('/add-astrologer', adminAuth, ctrl.addAstrologerAmount);

module.exports = router;
