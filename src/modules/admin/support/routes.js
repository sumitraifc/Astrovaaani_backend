const router    = require('express').Router();
const ctrl      = require('./controller');
const adminAuth = require('../../../middlewares/adminAuth');

router.get('/stats',            adminAuth, ctrl.getStats);
router.get('/',                 adminAuth, ctrl.getAll);
router.get('/:id',              adminAuth, ctrl.getById);
router.patch('/:id/status',     adminAuth, ctrl.updateStatus);
router.post('/:id/message',     adminAuth, ctrl.upload, ctrl.addMessage);

module.exports = router;
