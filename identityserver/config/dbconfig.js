import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

export const db_config = {
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

/*
export default [
    express.json(),
    db_config
];
*/
