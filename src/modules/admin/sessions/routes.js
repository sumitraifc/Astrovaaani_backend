const router    = require('express').Router();
const ctrl      = require('./controller');
const adminAuth = require('../../../middlewares/adminAuth');

router.get('/stats',          adminAuth, ctrl.getStats);
router.get('/user/:userId',   adminAuth, ctrl.getByUserId);
router.get('/',               adminAuth, ctrl.getSessions);
router.get('/:id',            adminAuth, ctrl.getById);

module.exports = router;
