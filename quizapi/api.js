const https = require('https');
const fs = require('fs');
const express = require('express');
const dotenv = require('dotenv');
const db = require('./api/db');
const quizRoutes = require('./api/routes/quiz');
const cors = require('cors');

dotenv.config();


const app = express();
// Enable CORS for all origins
app.use(cors());

db.connect();

app.use(express.json());

app.use('/quiz', quizRoutes);

// Read SSL certificate and private key files
const privateKey = fs.readFileSync('ssl/privateKey.pem', 'utf8');
const certificate = fs.readFileSync('ssl/certificate.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Create HTTPS server to listen on port 7777
const httpsServer = https.createServer(credentials, app);

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

httpsServer.listen(7777, () => {
  console.log('HTTPS server is running on port 7777');
});