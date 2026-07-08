const router = require('express').Router();
const ctrl   = require('./controller');
const auth   = require('../../middlewares/auth');

router.post('/',  auth, ctrl.submitReport);   // report submit
router.get('/',   auth, ctrl.getMyReports);   // meri reports

module.exports = router;
