const Player = require('../models/PlayerModel');
const Manager = require('../models/ManagerModel');

// Get all players for a manager's team
exports.getTeamPlayers = async (req, res) => {
  try {
    const { managerId } = req.params;
    const players = await Player.find({ managerId, isActive: true })
      .sort({ position: 1, rating: -1 });
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch players' });
  }
};

// Add a new player to team
exports.addPlayer = async (req, res) => {
  try {
    const { managerId, playerName, proClubName, position, preferredFoot, socialMedia } = req.body;
    
    // Check if player already exists in this team
    const existingPlayer = await Player.findOne({ managerId, proClubName });
    if (existingPlayer) {
      return res.status(400).json({ error: 'Player with this Pro Club name already exists in your team' });
    }

    const player = new Player({
      managerId,
      playerName,
      proClubName,
      position,
      preferredFoot,
      socialMedia
    });

    await player.save();
    res.status(201).json({ message: 'Player added successfully', player });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add player' });
  }
};

// Update player stats
exports.updatePlayerStats = async (req, res) => {
  try {
    const { playerId } = req.params;
    const updates = req.body;
    
    const player = await Player.findByIdAndUpdate(
      playerId,
      { $set: { stats: updates.stats } },
      { new: true }
    );
    
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    res.json({ message: 'Player stats updated', player });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update player stats' });
  }
};

// Remove player from team
exports.removePlayer = async (req, res) => {
  try {
    const { playerId } = req.params;
    await Player.findByIdAndUpdate(playerId, { isActive: false });
    res.json({ message: 'Player removed from team' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove player' });
  }
};

// Get top players (league leaders)
exports.getLeagueLeaders = async (req, res) => {
  try {
    const category = req.params.category || 'goals';
    const limit = parseInt(req.query.limit) || 10;
    
    const players = await Player.find({ isActive: true })
      .sort({ [`stats.${category}`]: -1 })
      .limit(limit)
      .populate('managerId', 'teamName teamLogo');
    
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch league leaders' });
  }
};

// Get player by ID
exports.getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)
      .populate('managerId', 'teamName teamLogo managerName');
    
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch player' });
  }
};
