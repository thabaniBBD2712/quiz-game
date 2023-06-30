const https = require('https');
const fs = require('fs');
const express = require('express');
const dotenv = require('dotenv');
const db = require('./api/db');
const quizRoutes = require('./api/routes/quiz');
const cors = require('cors');

dotenv.config();

const corsOptions = {
  origin: 'http://127.0.0.1:5500',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200,
};

const app = express();
// Enable CORS for all origins
app.use(cors(corsOptions));

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;

  try {
    const url = process.env.VERIFY;
    const fetcher = await fetch(url, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });

    if (fetcher.status == 200) {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error + Unauthenticated ' + error });
  }
};

app.use(verifyToken);


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