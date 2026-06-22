const router    = require('express').Router();
const ctrl      = require('./controller');
const adminAuth = require('../../../middlewares/adminAuth');
const upload    = require('../../../config/multer');

router.post('/upload-image', adminAuth, upload.single('image'), ctrl.uploadImage);
router.post('/',             adminAuth, ctrl.send);
router.get('/',              adminAuth, ctrl.getHistory);

module.exports = router;
