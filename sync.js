// sync.js
const sequelize = require('./config/db'); // Adjust the path as needed
const User = require('./models/user');
const Message = require('./models/message');

// Sync all models
sequelize.sync({ force: true }) // `force: true` will drop the tables if they already exist
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });