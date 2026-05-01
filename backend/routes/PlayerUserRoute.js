const express = require('express');
const router = express.Router();
const playerUserController = require('../controllers/PlayerUserController');

// Auth
router.post('/register', playerUserController.registerPlayer);
router.post('/login', playerUserController.loginPlayer);

// Get available players (no team)
router.get('/available', playerUserController.getAvailablePlayers);

// Get player by ID
router.get('/:id', playerUserController.getPlayerById);

// Update player
router.put('/:id', playerUserController.updatePlayer);

// Leave team
router.put('/:id/leave-team', playerUserController.leaveTeam);

module.exports = router;
