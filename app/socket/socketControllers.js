const io = require('./serverSocketIO');

function disconnectSocketByToken(token) {
  io.of('/chat').sockets.forEach(socket => {
    const { token: token2 } = socket.data;
    if (token === token2) {
      socket.disconnect(true);
    }
  });
}

function disconnectSocketByUserId(userId) {
  io.of('/chat').sockets.forEach(socket => {
    const { userId: userId2 } = socket.data.signature;
    if (userId === userId2) {
      socket.disconnect(true);
    }
  });
}
function leaveAllUserInRoom(roomId) {
  io.of('/chat').socketsLeave(roomId);
}

module.exports = {
  disconnectSocketByToken,
  disconnectSocketByUserId,
  leaveAllUserInRoom,
};
