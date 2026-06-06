const router    = require('express').Router();
const ctrl      = require('./controller');
const adminAuth = require('../../../middlewares/adminAuth');

router.post('/',   adminAuth, ctrl.send);
router.get('/',    adminAuth, ctrl.getHistory);

module.exports = router;
