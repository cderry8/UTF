const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/InvitationController');

// Send invitation
router.post('/send', invitationController.sendInvitation);

// Get player's invitations
router.get('/player/:playerId', invitationController.getPlayerInvitations);

// Get manager's invitations
router.get('/manager/:managerId', invitationController.getManagerInvitations);

// Respond to invitation
router.put('/respond/:invitationId', invitationController.respondToInvitation);

// Cancel invitation
router.delete('/:invitationId', invitationController.cancelInvitation);

// Get invitation counts
router.get('/counts/:playerId', invitationController.getInvitationCounts);

module.exports = router;
