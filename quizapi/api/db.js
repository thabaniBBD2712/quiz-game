const mssql = require('mssql');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  options: {
    encrypt: true, 
    trustServerCertificate: true,
  },
};

const pool = new mssql.ConnectionPool(dbConfig);

const connect = async () => {
  try {
    await pool.connect();
    console.log('Connected to the database');
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
};

const query = async (sql, params) => {
  try {
    const request = pool.request();
    if (params) {
      Object.keys(params).forEach((key) => {
        request.input(key, params[key]);
      });
    }
    const result = await request.query(sql);
    return result;
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;
  }
};

module.exports = {
  connect,
  query,
};