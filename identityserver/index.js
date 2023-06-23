import level from 'level'
import levelup from 'levelup';
import leveldown from 'leveldown';
import ttl from 'level-ttl';
import express from 'express';
import { port } from './config/config.js';
import handleRegisterRoute from './handlers/register.js';
import handleExchangeCredentialsRoute from './handlers/exchange-credentials.js'
import bearer from './middleware/verify-bearer.js';

const app = express();
app.locals.store = new level.Level('./store');
//app.locals.ttl = ttl(app.locals.store);

//routes
app.post('/register', handleRegisterRoute);
app.post('/login', handleExchangeCredentialsRoute);
app.get('/verify-authentication', bearer, (request, response) => response.send('Your are authenticated'));

app.listen(port, () => {
    console.log(`Identity server is running on port ${port} ...`);
});