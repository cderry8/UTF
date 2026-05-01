const express = require('express');
const router = express.Router();
const playerController = require('../controllers/PlayerController');

// Get all players for a manager's team
router.get('/team/:managerId', playerController.getTeamPlayers);

// Get player by ID
router.get('/:id', playerController.getPlayerById);

// Add a new player to team
router.post('/add', playerController.addPlayer);

// Update player stats
router.put('/stats/:playerId', playerController.updatePlayerStats);

// Remove player
router.put('/remove/:playerId', playerController.removePlayer);

// Get league leaders
router.get('/league/leaders/:category', playerController.getLeagueLeaders);

module.exports = router;
