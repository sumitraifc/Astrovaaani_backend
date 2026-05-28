const express = require('express');

const router = express.Router();

const controller =
    require('./controller');

router.post(
    '/generate-token',
    controller.generateToken
);

module.exports = router;