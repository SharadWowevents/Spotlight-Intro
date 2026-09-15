const express = require('express');
const router = express.Router();
const { getSuggestions, generateIntro } = require('../controllers/introController');

router.post('/suggest', getSuggestions);
router.post('/generate', generateIntro);

module.exports = router;