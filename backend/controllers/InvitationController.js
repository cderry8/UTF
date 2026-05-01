const Invitation = require('../models/InvitationModel');
const PlayerUser = require('../models/PlayerUserModel');
const Manager = require('../models/ManagerModel');

// Send team invitation
exports.sendInvitation = async (req, res) => {
  try {
    const { managerId, playerId, message } = req.body;
    
    // Check if player exists and is available
    const player = await PlayerUser.findById(playerId);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    if (player.status !== 'available' || player.currentTeam) {
      return res.status(400).json({ error: 'Player is not available' });
    }
    
    // Check if invitation already exists
    const existingInvite = await Invitation.findOne({
      managerId,
      playerId,
      status: 'pending'
    });
    
    if (existingInvite) {
      return res.status(400).json({ error: 'Invitation already sent' });
    }
    
    const invitation = new Invitation({
      managerId,
      playerId,
      message,
      status: 'pending'
    });
    
    await invitation.save();
    
    // Populate for response
    await invitation.populate('managerId', 'teamName teamLogo managerName');
    
    res.status(201).json({
      message: 'Invitation sent successfully',
      invitation
    });
  } catch (error) {
    console.error('Send invitation error:', error);
    res.status(500).json({ error: 'Failed to send invitation' });
  }
};

// Get invitations for a player
exports.getPlayerInvitations = async (req, res) => {
  try {
    const { playerId } = req.params;
    
    const invitations = await Invitation.find({ playerId })
      .populate('managerId', 'teamName teamLogo managerName')
      .sort({ sentAt: -1 });
    
    res.json(invitations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invitations' });
  }
};

// Get invitations sent by manager
exports.getManagerInvitations = async (req, res) => {
  try {
    const { managerId } = req.params;
    
    const invitations = await Invitation.find({ managerId })
      .populate('playerId', 'fullName proClubName preferredPosition')
      .sort({ sentAt: -1 });
    
    res.json(invitations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invitations' });
  }
};

// Respond to invitation (accept/decline)
exports.respondToInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const { response, message } = req.body; // response: 'accepted' or 'declined'
    
    const invitation = await Invitation.findById(invitationId);
    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }
    
    if (invitation.status !== 'pending') {
      return res.status(400).json({ error: 'Invitation already responded' });
    }
    
    invitation.status = response;
    invitation.responseMessage = message || '';
    invitation.respondedAt = new Date();
    
    await invitation.save();
    
    // If accepted, update player team
    if (response === 'accepted') {
      const player = await PlayerUser.findById(invitation.playerId);
      const manager = await Manager.findById(invitation.managerId);
      
      if (!player || !manager) {
        return res.status(404).json({ error: 'Player or manager not found' });
      }
      
      // Update player
      player.currentTeam = manager._id;
      player.status = 'in_team';
      await player.save();
      
      // Update manager's players array
      if (!manager.players) {
        manager.players = [];
      }
      manager.players.push(player._id);
      await manager.save();
      
      // Decline other pending invitations
      await Invitation.updateMany(
        { playerId: player._id, status: 'pending', _id: { $ne: invitationId } },
        { status: 'declined', responseMessage: 'Accepted another team offer' }
      );
    }
    
    res.json({
      message: `Invitation ${response}`,
      invitation
    });
  } catch (error) {
    console.error('Respond to invitation error:', error);
    res.status(500).json({ error: 'Failed to respond to invitation' });
  }
};

// Cancel invitation (manager)
exports.cancelInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    
    const invitation = await Invitation.findById(invitationId);
    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }
    
    if (invitation.status !== 'pending') {
      return res.status(400).json({ error: 'Cannot cancel responded invitation' });
    }
    
    await Invitation.findByIdAndDelete(invitationId);
    
    res.json({ message: 'Invitation cancelled' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel invitation' });
  }
};

// Get invitation counts (for badges)
exports.getInvitationCounts = async (req, res) => {
  try {
    const { playerId } = req.params;
    
    const pendingCount = await Invitation.countDocuments({
      playerId,
      status: 'pending'
    });
    
    res.json({ pendingCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get counts' });
  }
};
