const socketControllers = require('./socketControllers');

const io = require('./serverSocketIO');

module.exports = {
  ...socketControllers,
  io,
};
