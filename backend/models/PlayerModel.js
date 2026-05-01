const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager', required: true },
  playerName: { type: String, required: true },
  proClubName: { type: String, required: true },
  position: { type: String, enum: ['GK', 'DEF', 'MID', 'FWD', 'ANY'], required: true },
  preferredFoot: { type: String, enum: ['Left', 'Right', 'Both'], default: 'Right' },
  stats: {
    matchesPlayed: { type: Number, default: 0 },
    goals: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
    cleanSheets: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    tackles: { type: Number, default: 0 },
    motmAwards: { type: Number, default: 0 },
    yellowCards: { type: Number, default: 0 },
    redCards: { type: Number, default: 0 },
  },
  rating: { type: Number, default: 0 },
  socialMedia: [{ platform: String, link: String }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

playerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Player', playerSchema);
