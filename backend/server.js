const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connect = require('./config/Db');

dotenv.config();
const PORT = process.env.PORT;

connect();

const app = express();

// Set up CORS to allow requests from the frontend (React or Next.js)
app.use(cors({ origin: 'http://localhost:3001' })); 

// Increase the body size limit to handle larger requests (10MB in this case)
app.use(express.json({ limit: '10mb' }));  // You can adjust '10mb' as needed

// Your route setups
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

// Start the server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT} ✅`));
