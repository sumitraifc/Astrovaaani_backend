const router = require('express').Router();
const ctrl = require('./controller');
const adminAuth = require('../../../middlewares/adminAuth');

router.post('/login', ctrl.login);
router.put('/change-password', adminAuth, ctrl.changePassword);

module.exports = router;
