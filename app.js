require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('./middleware/logger');

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin.route');
const parentProfileRoutes = require('./routes/parentProfile.routes');
const studentRoutes = require('./routes/student.routes');

app.use(express.json());
app.use(logger);

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/parent-profile', parentProfileRoutes);
app.use('/api/student', studentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
