const { Message } = require('../models');

Message.create({
  body: 'Hey',
  sender: 1,
  recipient: 2,
});

Message.create({
  body: 'Sup',
  sender: 2,
  recipient: 1,
});

Message.create({
  body: 'Nm u?',
  sender: 1,
  recipient: 2,
});
