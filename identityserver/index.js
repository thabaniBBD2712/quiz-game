import level from 'level';
import dotenv from 'dotenv';
import express from 'express';
import { port } from './config/config.js';
import handleRegisterRoute from './handlers/register.js';
import handleExchangeCredentialsRoute from './handlers/exchange-credentials.js';
import bearer from './middleware/verify-bearer.js';
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config()

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

/*
router.use((request, response, next) => {
    console.log('middleware');
    next();
})*/

/*
router.route('/user/:userId').get((request, response) => {
    getUser(request.params.userId)
        .then((data) => {
            if (data) {
                response.json(data);
            } else {
                response.status(404).json({ error: 'User not found' });
            }
        })
        .catch((err) => {
            console.log(err);
            response.status(500).json({ error: 'Internal server error' });
        });
});*/

app.locals.store = new level.Level('./store');

//routes
app.post('/register', handleRegisterRoute);
app.post('/login', handleExchangeCredentialsRoute);
app.get('/verify-authentication', bearer, (request, response) => response.send('Your are authenticated'));

app.listen(port, () => {
    console.log(`Identity server is running on port ${port} ...`);
});