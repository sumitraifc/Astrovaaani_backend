const express = require('express');
const router = express.Router();
const controller = require('./controller');

// Astrologer live token generate karo
router.post('/generate-live-token', controller.generateLiveToken);

// User (viewer) ka token generate karo
router.post('/generate-viewer-token', controller.getViewerToken);

module.exports = router;