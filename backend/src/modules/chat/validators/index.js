const conversationValidators = require('./conversation.validators');
const messageValidators = require('./message.validators');

module.exports = {
  ...conversationValidators,
  ...messageValidators,
};

