const router    = require('express').Router();
const ctrl      = require('./controller');
const adminAuth = require('../../middlewares/adminAuth');

router.get('/',              adminAuth, ctrl.getAll);
router.get('/:id',           adminAuth, ctrl.getById);
router.patch('/:id/block',   adminAuth, ctrl.block);
router.patch('/:id/unblock', adminAuth, ctrl.unblock);
router.delete('/:id',        adminAuth, ctrl.delete);
router.post('/:id/wallet',   adminAuth, ctrl.addWallet);

module.exports = router;
