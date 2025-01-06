const { Client } = require('pg');
require('dotenv').config(); // Load environment variables from .env file

// Create a new client using the DATABASE_URL from .env
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Required for Neon.tech's SSL
    },
});

// Connect to the database
client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Connection error', err));

module.exports = client;