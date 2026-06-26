const router    = require('express').Router();
const ctrl      = require('./controller');
const adminAuth = require('../../../middlewares/adminAuth');

// Referral bonus settings
router.get('/',    adminAuth, ctrl.get);
router.put('/',    adminAuth, ctrl.update);

// Gift amounts CRUD
router.get('/gifts',         adminAuth, ctrl.getGifts);
router.post('/gifts',        adminAuth, ctrl.uploadMiddleware, ctrl.createGift);
router.put('/gifts/:id',     adminAuth, ctrl.uploadMiddleware, ctrl.updateGift);
router.delete('/gifts/:id',  adminAuth, ctrl.deleteGift);

module.exports = router;
