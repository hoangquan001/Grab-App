const { verifyToken } = require('../dataSources/utils/redis');

async function authenticateMiddleware(socket, next) {
  // const chatIO = this;
  try {
    const { token } = socket.handshake.auth;
    const verifyResult = await verifyToken(token);
    if (!verifyResult.isSuccess) {
      next(new Error(verifyResult.message));
      socket.disconnect(true);
      return;
    }
    socket.data.signature = verifyResult.signature;
    socket.data.token = token;

    next();
  } catch (e) {
    next(e);
  }
}

module.exports = { authenticateMiddleware };
