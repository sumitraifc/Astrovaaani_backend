const router    = require('express').Router();
const ctrl      = require('./controller');
const adminAuth = require('../../../middlewares/adminAuth');

router.get('/',      adminAuth, ctrl.getAll);
router.post('/',     adminAuth, ctrl.upload, ctrl.create);
router.put('/:id',   adminAuth, ctrl.upload, ctrl.update);
router.delete('/:id',adminAuth, ctrl.delete);

module.exports = router;
