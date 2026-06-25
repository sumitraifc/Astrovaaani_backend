const router    = require('express').Router();
const ctrl      = require('./controller');
const adminAuth = require('../../../middlewares/adminAuth');

router.get('/',                 adminAuth, ctrl.getList);
router.patch('/:id/approve',    adminAuth, ctrl.approve);
router.patch('/:id/reject',     adminAuth, ctrl.reject);

module.exports = router;
