const router    = require('express').Router();
const ctrl      = require('./controller');
const adminAuth = require('../../../middlewares/adminAuth');

router.get('/profile',  adminAuth, ctrl.getProfile);
router.put('/bank',     adminAuth, ctrl.updateBankDetails);
router.get('/history',  adminAuth, ctrl.getPayoutHistory);
router.post('/request', adminAuth, ctrl.requestPayout);

module.exports = router;
