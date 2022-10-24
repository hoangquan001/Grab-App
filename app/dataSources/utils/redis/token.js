const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const redisClient = require('./redisClient');
const { getUserFromCache } = require('./user');

const config = require('../../../config');

function hashToken(token) {
  return crypto.createHmac(config.jwt.hashAlogrithm, config.jwt.secretKey).update(token).digest('hex');
}

async function getBlockedToken(token) {
  const hashedToken = `bl:${hashToken(token)}`;
  const result = await redisClient.get(hashedToken);
  return result;
}

async function setBlockedToken(token, expiresIn) {
  const hashedToken = `bl:${hashToken(token)}`;
  await redisClient.setEx(hashedToken, expiresIn, '1');
}

async function verifyToken(token) {
  // Check invalid token
  if (!token) {
    return { isSuccess: false, message: 'Invalid token' };
  }

  // Check token rejected
  const inBlackList = await getBlockedToken(token);
  if (inBlackList) {
    return { isSuccess: false, message: 'Token rejected' };
  }

  const { userId } = jwt.verify(token, config.jwt.secretKey);
  // Caching
  const user = await getUserFromCache(userId);
  if (!user) {
    return { isSuccess: false, message: 'User not found' };
  }

  // Check if user is active
  if (user.status === 'Deactivated' || user.status === 'Pending') {
    setBlockedToken(token, config.jwt.expireTime);
    return { isSuccess: false, message: 'Token rejected' };
  }
  const signature = { userId, userRole: user.role };
  return { isSuccess: true, signature };
}

module.exports = {
  getBlockedToken,
  setBlockedToken,
  verifyToken,
};
