const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const orgRoutes = require('./routes/org.routes');
const eventsRoutes = require('./routes/events.routes');
const volunteersRoutes = require('./routes/volunteers.routes');
const organiserRoutes = require('./routes/organiser.routes');
const messagesRoutes = require('./routes/messages.routes');
const communityRoutes = require('./routes/community.routes');
const authMiddleware = require('./middleware/auth.middleware');

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL
    ];

    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app')
    ) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/org', orgRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/volunteers', volunteersRoutes);
app.use('/api/organiser', organiserRoutes);
app.use('/api/messages', authMiddleware, messagesRoutes);
app.use('/api/community', communityRoutes);

// TEMPORARY: Debug route to run migrations manually
const { exec } = require('child_process');
app.get('/api/debug-migrate', (req, res) => {
  console.log('Starting manual migration...');
  exec('npx prisma db push', (error, stdout, stderr) => {
    if (error) {
      console.error(`Migration Error: ${error.message}`);
      return res.status(500).json({ 
        status: 'Error', 
        error: error.message, 
        stderr: stderr 
      });
    }
    console.log(`Migration Success: ${stdout}`);
    res.json({ 
      status: 'Success', 
      message: 'Database migrated successfully', 
      output: stdout 
    });
  });
});

app.get('/', (req, res) => {
  res.send({ status: 'OK', message: 'Volunteer Connect API running' });
});

module.exports = app;
