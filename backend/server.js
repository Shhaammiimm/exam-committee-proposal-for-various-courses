require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');

const examRoutes = require('./routes/exam');
const courseRoutes = require('./routes/course');
const committeeRoutes = require('./routes/committee');
const examRelatedRoutes = require('./routes/examRelated');
const summaryRoutes = require('./routes/summary');
const authRoutes = require('./routes/auth');
const proposalRoutes = require('./routes/proposals');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/exam', examRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/committee', committeeRoutes);
app.use('/api/exam-related', examRelatedRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/proposals', proposalRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Exam Committee API is running', db: 'MongoDB Atlas' });
});

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
