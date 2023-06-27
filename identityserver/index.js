import level from 'level';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
import express from 'express';
import { port } from './config/config.js';
import handleRegisterRoute from './handlers/register.js';
import handleExchangeCredentialsRoute from './handlers/login.js';
import bearer from './middleware/verify-bearer.js';
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config()

const app = express();

const allowedOrigins = ['https://ourFrontend.cloudfront.net'];

const corsOptions = {
    origin: function (origin, callback){
        if(allowedOrigins.indexOf(origin) !== -1){
            callback(null, true)
        }else{
            callback(new Error('Not allowed by CORS'))
        }
        
    }
};

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.locals.store = new level.Level('./store');

//routes
app.get('/', (req, res) => {
    res.send("Entry Point");
})
app.post('/register', handleRegisterRoute);
app.post('/login', handleExchangeCredentialsRoute);
app.get('/verify-authentication', bearer, (request, response) => response.send('Your are authenticated'));

// Read SSL certificate and private key files
const privateKey = fs.readFileSync('privateKey.pem', 'utf8');
const certificate = fs.readFileSync('certificate.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });
  
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  });

httpsServer.listen(port, () => {
    console.log(`Identity server is running on port ${port} ...`);
});