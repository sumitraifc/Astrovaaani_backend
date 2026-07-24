const router  = require('express').Router();
const ctrl    = require('./controller');
const adminAuth = require('../../../middlewares/adminAuth');

router.get('/',                       adminAuth, ctrl.getList);
router.get('/:id',                    adminAuth, ctrl.getById);
router.put('/:id',                    adminAuth, ctrl.update);
router.patch('/:id/step/:step',       adminAuth, ctrl.updateStepStatus);
router.patch('/:id/block',            adminAuth, ctrl.block);
router.patch('/:id/unblock',          adminAuth, ctrl.unblock);
router.patch('/:id/commission',       adminAuth, ctrl.updateCommission);
router.delete('/:id',                 adminAuth, ctrl.delete);

module.exports = router;
