const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connect = require('./config/Db');

dotenv.config();
const PORT = process.env.PORT;

connect();

const app = express();


app.use(cors({ origin: 'http://localhost:3000' })); 


app.use(express.json({ limit: '10mb' }));  


const staffRoutes = require('./routes/StaffRoute');
app.use('/utf/staff', staffRoutes);

const managerRoutes = require('./routes/ManagerRoute');
app.use('/utf/managers', managerRoutes);

const tableRoutes = require('./routes/TableRoute');
app.use('/utf/table', tableRoutes);

const authRoutes = require('./routes/AuthRoute');
app.use('/utf/auth', authRoutes);

const fixtureRoutes = require('./routes/FixtureRoute');
app.use('/utf/fixtures', fixtureRoutes);


const resultRoutes = require('./routes/ResultsRoute');
app.use('/utf/results', resultRoutes);

const playerRoutes = require('./routes/PlayerRoute');
app.use('/utf/players', playerRoutes);

const playerUserRoutes = require('./routes/PlayerUserRoute');
app.use('/utf/player-users', playerUserRoutes);

const invitationRoutes = require('./routes/InvitationRoute');
app.use('/utf/invitations', invitationRoutes);

const messageRoutes = require('./routes/MessageRoute');
app.use('/utf/messages', messageRoutes);

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT} ✅`));
