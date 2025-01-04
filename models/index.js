const User = require('./user');
const Message = require('./message');

// Set up associations
User.hasMany(Message, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  Message
};
