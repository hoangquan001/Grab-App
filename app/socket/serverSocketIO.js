const { Server } = require('socket.io');

const { authenticateMiddleware } = require('./middleware');
const chatHandle = require('./chatHandle');

const io = new Server();
const chatIO = io.of('/chat');

function onConnection(socket) {
  chatHandle(chatIO, socket);
}
chatIO.use(authenticateMiddleware);
chatIO.on('connection', onConnection);

module.exports = io;
