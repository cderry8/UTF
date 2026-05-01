const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  // Who sent the invite
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manager',
    required: true
  },
  
  // Who received the invite
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlayerUser',
    required: true
  },
  
  // Status of the invitation
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  
  // Message from manager
  message: {
    type: String,
    maxLength: 500
  },
  
  // Response from player
  responseMessage: {
    type: String,
    maxLength: 500
  },
  
  // Timestamps
  sentAt: { type: Date, default: Date.now },
  respondedAt: { type: Date },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } // 7 days
});

// Index for faster queries
invitationSchema.index({ playerId: 1, status: 1 });
invitationSchema.index({ managerId: 1, status: 1 });

const Invitation = mongoose.model('Invitation', invitationSchema);
module.exports = Invitation;
