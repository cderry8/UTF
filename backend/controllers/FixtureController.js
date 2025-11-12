const Manager = require('../models/ManagerModel');
const Fixture = require('../models/FixtureModel');

// Generate a double round-robin schedule (home and away)
function generateDoubleRoundRobin(teams) {
  const n = teams.length;
  const half = n - 1;
  const schedule = [];

  const rotation = teams.slice();
  for (let round = 0; round < half; round++) {
    const pairings = [];
    for (let i = 0; i < n / 2; i++) {
      const home = rotation[i];
      const away = rotation[n - 1 - i];
      if (round % 2 === 0) pairings.push({ home, away });
      else pairings.push({ home: away, away: home });
    }
    schedule.push(pairings);

    // Clockwise rotation (except first)
    const [first, ...rest] = rotation;
    rotation.splice(1);
    rotation.push(...rest.slice(0, rest.length - 1));
    rotation.splice(1, 0, rest[rest.length - 1]);
  }

  const secondHalf = schedule.map(pairs =>
    pairs.map(g => ({ home: g.away, away: g.home }))
  );
  return schedule.concat(secondHalf);
}

const generateSingleGameweek = async (req, res) => {
  const gameweek = parseInt(req.params.gameweek);
  try {
    const managers = await Manager.find({ status: 'accepted' });
    const teams = managers.map(m => m.teamName);

    if (teams.length % 2 !== 0) {
      return res.status(400).json({ message: 'Number of teams must be even' });
    }

    const allRounds = generateDoubleRoundRobin(teams);

    if (gameweek < 1 || gameweek > allRounds.length) {
      return res.status(400).json({ message: `Invalid gameweek. Must be 1 to ${allRounds.length}` });
    }

    const fixtures = allRounds[gameweek - 1].map(match => ({
      homeTeamName: match.home,
      awayTeamName: match.away,
      gameweek
    }));

    res.json({ gameweek, fixtures });
  } catch (err) {
    res.status(500).json({ error: 'Error generating fixtures', err });
  }
};

const saveGameweekFixtures = async (req, res) => {
  const gameweek = parseInt(req.params.gameweek);
  const { fixtures } = req.body;

  try {
    const existingFixtures = await Fixture.find({ gameweek });
    if (existingFixtures.length > 0) {
      return res.status(400).json({ message: 'Gameweek fixtures already saved' });
    }

    const managers = await Manager.find({ status: 'accepted' });

    // Normalize team names and map to IDs
    const teamMap = {};
    managers.forEach(manager => {
      const name = manager.teamName.toLowerCase().trim();
      teamMap[name] = manager._id;
    });

    const fixturesToSave = fixtures.map(f => {
      const homeName = f.homeTeamName.toLowerCase().trim();
      const awayName = f.awayTeamName.toLowerCase().trim();

      const homeTeamId = teamMap[homeName];
      const awayTeamId = teamMap[awayName];

      if (!homeTeamId || !awayTeamId) {
        throw new Error(`Team not found: ${f.homeTeamName} or ${f.awayTeamName}`);
      }

      return {
        gameweek,
        homeTeam: homeTeamId,
        awayTeam: awayTeamId,
        date: f.date || Date.now(),
        venue: f.venue || 'TBD'
      };
    });

    const savedFixtures = await Fixture.insertMany(fixturesToSave);
    res.status(201).json({ message: 'Fixtures saved successfully', savedFixtures });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: 'Error saving fixtures', err });
  }
};

const getAllFixturesByGameweek = async (req, res) => {
  try {
    const allFixtures = await Fixture.find().sort({ gameweek: 1 });
    const grouped = {};

    allFixtures.forEach(fix => {
      if (!grouped[fix.gameweek]) grouped[fix.gameweek] = [];
      grouped[fix.gameweek].push(fix);
    });

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching fixtures', err });
  }
};

const updateFixture = async (req, res) => {
  const fixtureId = req.params.id;
  const { homeTeamName, awayTeamName, date, venue } = req.body;

  try {
    const fixture = await Fixture.findByIdAndUpdate(fixtureId, {
      homeTeamName,
      awayTeamName,
      date,
      venue
    }, { new: true });

    if (!fixture) {
      return res.status(404).json({ message: 'Fixture not found' });
    }

    res.json({ message: 'Fixture updated successfully', fixture });
  } catch (err) {
    res.status(500).json({ error: 'Error updating fixture', err });
  }
};

const deleteGameweekFixtures = async (req, res) => {
  const gameweek = parseInt(req.params.gameweek);

  try {
    const deletedFixtures = await Fixture.deleteMany({ gameweek });
    if (deletedFixtures.deletedCount === 0) {
      return res.status(404).json({ message: 'No fixtures found for this gameweek' });
    }

    res.json({ message: 'Fixtures deleted successfully', deletedCount: deletedFixtures.deletedCount });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting fixtures', err });
  }
};

const getLatestFixtures = async (req, res) => {
  try {
    // Find the most recent gameweek
    const latestFixture = await Fixture.findOne().sort({ gameweek: -1 }).limit(1);
    if (!latestFixture) {
      return res.status(200).json({ gameweek: null, fixtures: [] });
    }

    const gameweek = latestFixture.gameweek;

    // Fetch and populate both homeTeam and awayTeam
    const fixtures = await Fixture.find({ gameweek })
      .populate('homeTeam', 'teamName teamLogo') // <--- Populate with selected fields
      .populate('awayTeam', 'teamName teamLogo');

    res.status(200).json({ gameweek, fixtures });
  } catch (error) {
    console.error('Error fetching latest fixtures:', error);
    res.status(500).json({ error: 'Failed to fetch fixtures' });
  }
};

module.exports = {
  generateSingleGameweek,
  saveGameweekFixtures,
  getLatestFixtures,
  getAllFixturesByGameweek,
  updateFixture,
  deleteGameweekFixtures
};
