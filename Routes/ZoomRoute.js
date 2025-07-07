const express = require('express');
const { start } = require('../Controllers/ZoomController');
router = express.Router();

router.post('/startMeeting', start);

module.exports = router;