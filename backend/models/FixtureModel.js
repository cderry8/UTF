const mongoose = require('mongoose');

const fixtureSchema = new mongoose.Schema({
  gameweek: { type: Number, required: true },
  homeTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager', required: true },
  awayTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager', required: true },
  date: { type: Date, default: Date.now },
  venue: { type: String, default: 'TBD' }
});

const Fixture = mongoose.model('Fixture', fixtureSchema);
module.exports = Fixture;
