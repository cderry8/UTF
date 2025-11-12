const express = require('express');
const router = express.Router();
const {
  submitMatchResult,
  getLeagueTable
} = require('../controllers/TableController');

router.post('/match', submitMatchResult);
router.get('/', getLeagueTable);

module.exports = router;
