const router = require('express').Router();
const ctrl   = require('./controller');
const auth   = require('../../middlewares/auth');

router.post('/',                         auth, ctrl.block);       // block karo
router.post('/unblock',                 auth, ctrl.unblock);     // unblock karo
router.get('/',                         auth, ctrl.getBlockList); // meri block list
router.get('/:targetType/:targetId',    auth, ctrl.checkBlock);  // check karo blocked hai ya nahi

module.exports = router;
