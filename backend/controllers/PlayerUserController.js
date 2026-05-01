const PlayerUser = require('../models/PlayerUserModel');
const Manager = require('../models/ManagerModel');
const jwt = require('jsonwebtoken');

// Register as player
exports.registerPlayer = async (req, res) => {
  try {
    const { fullName, email, password, age, country, proClubName, preferredPosition, preferredFoot, console, socialMedia, ipAddress } = req.body;
    
    // Check if email exists
    const existingPlayer = await PlayerUser.findOne({ email });
    if (existingPlayer) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Check if proClubName exists
    const existingProClub = await PlayerUser.findOne({ proClubName });
    if (existingProClub) {
      return res.status(400).json({ error: 'Pro Club name already taken' });
    }
    
    const player = new PlayerUser({
      fullName, email, password, age, country,
      proClubName, preferredPosition, preferredFoot, console,
      socialMedia: socialMedia || [],
      ipAddress
    });
    
    await player.save();
    
    // Generate token
    const token = jwt.sign(
      { id: player._id, email: player.email, type: 'player' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'Player registered successfully',
      data: { ...player.toObject(), password: undefined },
      token,
      userType: 'player'
    });
  } catch (error) {
    console.error('Player registration error:', error);
    res.status(500).json({ error: 'Failed to register player' });
  }
};

// Login as player
exports.loginPlayer = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const player = await PlayerUser.findOne({ email });
    if (!player) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isMatch = await player.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: player._id, email: player.email, type: 'player' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      data: { ...player.toObject(), password: undefined },
      token,
      userType: 'player'
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// Get available players (no team)
exports.getAvailablePlayers = async (req, res) => {
  try {
    const players = await PlayerUser.find({ 
      status: 'available',
      currentTeam: null
    }).select('-password');
    
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch players' });
  }
};

// Get player by ID
exports.getPlayerById = async (req, res) => {
  try {
    const player = await PlayerUser.findById(req.params.id)
      .populate('currentTeam', 'teamName teamLogo')
      .select('-password');
    
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch player' });
  }
};

// Update player profile
exports.updatePlayer = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Don't allow password update here
    delete updates.currentTeam; // Don't allow direct team change
    
    const player = await PlayerUser.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    ).select('-password');
    
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    res.json({ message: 'Profile updated', player });
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
};

// Leave current team
exports.leaveTeam = async (req, res) => {
  try {
    const player = await PlayerUser.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    if (!player.currentTeam) {
      return res.status(400).json({ error: 'Not in a team' });
    }
    
    // Add to team history
    player.teamHistory.push({
      teamId: player.currentTeam,
      joinedAt: player.teamHistory.length > 0 ? player.teamHistory[player.teamHistory.length - 1].joinedAt : player.createdAt,
      leftAt: new Date()
    });
    
    player.currentTeam = null;
    player.status = 'available';
    
    await player.save();
    
    res.json({ message: 'Left team successfully', player });
  } catch (error) {
    res.status(500).json({ error: 'Failed to leave team' });
  }
};
