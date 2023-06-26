import level from 'level'
import mssql from 'mssql';
import dotenv from 'dotenv';
import express from 'express';
import { port } from './config/config.js';
import handleRegisterRoute from './handlers/register.js';
import handleExchangeCredentialsRoute from './handlers/exchange-credentials.js'
import bearer from './middleware/verify-bearer.js';

dotenv.config()

const app = express();

const db_config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 3000
    },
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

mssql.on('error', err => {})
mssql.connect(db_config).then(pool => {
    return pool.request().input('input_parameter', mssql.VarChar, 'motheo1').query('select * from Player where playerID = @input_parameter')
}).then(result =>{
    console.log(result);
    console.log('success')
}).catch(err => {console.log(err)})
app.locals.store = new level.Level('./store');
//app.locals.ttl = ttl(app.locals.store);

//routes
app.post('/register', handleRegisterRoute);
app.post('/login', handleExchangeCredentialsRoute);
app.get('/verify-authentication', bearer, (request, response) => response.send('Your are authenticated'));

app.listen(port, () => {
    console.log(`Identity server is running on port ${port} ...`);
});