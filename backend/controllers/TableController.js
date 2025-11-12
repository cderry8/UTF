const Manager = require('../models/ManagerModel');
const LeagueStats = require('../models/TableModel');

// Submit a match result
const submitMatchResult = async (req, res) => {
  const { yourTeam, opponentTeam, yourScore, opponentScore } = req.body;

  if (!yourTeam || !opponentTeam || yourScore === undefined || opponentScore === undefined) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Get managers by team name
    const [yourManager, opponentManager] = await Promise.all([
      Manager.findOne({ teamName: yourTeam, status: 'accepted' }),
      Manager.findOne({ teamName: opponentTeam, status: 'accepted' })
    ]);

    if (!yourManager || !opponentManager) {
      return res.status(404).json({ message: 'One or both teams not found or not accepted.' });
    }

    // Get or create league stats
    const [yourStats, opponentStats] = await Promise.all([
      LeagueStats.findOneAndUpdate(
        { managerId: yourManager._id },
        {},
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ),
      LeagueStats.findOneAndUpdate(
        { managerId: opponentManager._id },
        {},
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    ]);

    // Update matches
    yourStats.matchesPlayed += 1;
    opponentStats.matchesPlayed += 1;

    // Update goals
    yourStats.goalsFor += yourScore;
    yourStats.goalsAgainst += opponentScore;
    opponentStats.goalsFor += opponentScore;
    opponentStats.goalsAgainst += yourScore;

    // Goal difference
    yourStats.goalDifference = yourStats.goalsFor - yourStats.goalsAgainst;
    opponentStats.goalDifference = opponentStats.goalsFor - opponentStats.goalsAgainst;

    // Result logic
    if (yourScore > opponentScore) {
      yourStats.wins += 1;
      yourStats.points += 3;
      opponentStats.losses += 1;
    } else if (yourScore < opponentScore) {
      opponentStats.wins += 1;
      opponentStats.points += 3;
      yourStats.losses += 1;
    } else {
      yourStats.draws += 1;
      opponentStats.draws += 1;
      yourStats.points += 1;
      opponentStats.points += 1;
    }

    await yourStats.save();
    await opponentStats.save();

    res.json({ message: 'Match result submitted and league stats updated.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get league table with team names from Manager
const getLeagueTable = async (req, res) => {
  try {
    // Get all accepted managers
    const acceptedManagers = await Manager.find({ status: 'accepted' });

    // Build full table
    const fullTable = await Promise.all(
      acceptedManagers.map(async (manager) => {
        // Try to find existing stats
        const stats = await LeagueStats.findOne({ managerId: manager._id });

        return {
          managerId: manager._id,
          managerName: manager.managerName,
          teamName: manager.teamName,
          teamLogo: manager.teamLogo,
          country: manager.country,
          console: manager.console,
          matchesPlayed: stats?.matchesPlayed || 0,
          wins: stats?.wins || 0,
          losses: stats?.losses || 0,
          draws: stats?.draws || 0,
          goalsFor: stats?.goalsFor || 0,
          goalsAgainst: stats?.goalsAgainst || 0,
          goalDifference: stats?.goalDifference || 0,
          points: stats?.points || 0
        };
      })
    );

    // Sort table
    fullTable.sort((a, b) => {
      if (b.points === a.points) {
        return b.goalDifference - a.goalDifference;
      }
      return b.points - a.points;
    });

    res.json(fullTable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  submitMatchResult,
  getLeagueTable
};
