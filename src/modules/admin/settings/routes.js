const router    = require('express').Router();
const ctrl      = require('./controller');
const adminAuth = require('../../../middlewares/adminAuth');

router.get('/',  adminAuth, ctrl.get);
router.put('/',  adminAuth, ctrl.update);

module.exports = router;
