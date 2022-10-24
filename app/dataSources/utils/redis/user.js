const { User } = require('../../models');
const redisClient = require('./redisClient');

async function getUserFromCache(userId) {
  let user = JSON.parse(await redisClient.get(`user:${userId}`));

  if (user) {
    return user;
  }

  user = await User.findById(userId).lean();
  if (!user) return null;

  await redisClient.setEx(`user:${userId}`, 60 * 60 * 12, JSON.stringify(user));

  return user;
}

module.exports = {
  getUserFromCache,
};
