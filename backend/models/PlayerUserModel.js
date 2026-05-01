const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const playerUserSchema = new mongoose.Schema({
  // Basic Info
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true, min: 13 },
  country: { type: String, required: true },
  
  // Pro Clubs Info
  proClubName: { type: String, required: true },
  preferredPosition: { 
    type: String, 
    enum: ['GK', 'DEF', 'MID', 'FWD', 'ANY'],
    required: true 
  },
  preferredFoot: {
    type: String,
    enum: ['Left', 'Right', 'Both'],
    default: 'Right'
  },
  console: {
    type: String,
    enum: ['PS5', 'Xbox', 'PC'],
    required: true
  },
  
  // Team Assignment
  currentTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manager',
    default: null
  },
  teamHistory: [{
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager' },
    joinedAt: { type: Date },
    leftAt: { type: Date }
  }],
  
  // Status
  status: {
    type: String,
    enum: ['available', 'in_team', 'pending'],
    default: 'available'
  },
  
  // Social & Contact
  socialMedia: [{
    platform: { type: String },
    link: { type: String }
  }],
  
  // IP for tracking
  ipAddress: { type: String },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
playerUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.updatedAt = Date.now();
  next();
});

// Compare password method
playerUserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const PlayerUser = mongoose.model('PlayerUser', playerUserSchema);
module.exports = PlayerUser;
