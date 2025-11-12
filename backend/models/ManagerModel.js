  const mongoose = require('mongoose');
  const bcrypt = require('bcryptjs');

  const managerSchema = new mongoose.Schema({
    managerName: { type: String, required: true },
    teamName: { type: String, required: true, unique: true },
    teamLogo: { type: String, required: true },
    managerAge: { type: Number, required: true, min: 10 },
    status: {
      type: String,
      enum: ['accepted', 'pending', 'denied'],
      default: 'pending'
    },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    country: { type: String, required: true },
    console: { type: String, enum: ['PS5', 'Xbox', 'PC', 'Other'], required: true },
    socialMedia: [
      {
        platform: { type: String },
        link: { type: String }
      }
    ],
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    ipAddress: { type: String, required: true }, // Add IP Address field
    createdAt: { type: Date, default: Date.now }
  });


  managerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });

  const Manager = mongoose.model('Manager', managerSchema);
  module.exports = Manager;
