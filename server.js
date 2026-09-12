require('dotenv').config();
const express = require('express');
const cors = require('cors');

const appointmentRoute = require('./src/routes/appointment.route');
const authRoute = require('./src/routes/auth.route');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api', appointmentRoute);
app.use('/api/auth', authRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});