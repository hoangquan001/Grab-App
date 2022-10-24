const redisClient = require('./redisClient');
const userControllers = require('./user');
const tokenControllers = require('./token');

module.exports = {
  redisClient,
  ...userControllers,
  ...tokenControllers,
};
