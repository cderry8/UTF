const express = require('express');
const router = express.Router();
const {
  generateSingleGameweek,
  saveGameweekFixtures,
  getAllFixturesByGameweek,
  getLatestFixtures, // ✅ New route handler
  updateFixture,
  deleteGameweekFixtures
} = require('../controllers/FixtureController');

// Generate fixtures for a specific gameweek
router.get('/generate/:gameweek', generateSingleGameweek);

// Save fixtures for a specific gameweek
router.post('/save/:gameweek', saveGameweekFixtures);

// Fetch all fixtures grouped by gameweek
router.get('/all', getAllFixturesByGameweek);

// ✅ Get latest saved gameweek fixtures
router.get('/latest', getLatestFixtures);

// Update a specific fixture (home/away, date, venue)
router.put('/fixture/:id', updateFixture);

// Delete all fixtures for a specific gameweek
router.delete('/gameweek/:gameweek', deleteGameweekFixtures);

module.exports = router;
