const redis = require('redis');

const redisClient = redis.createClient();
redisClient.connect();
redisClient.on('ready', () => {
  logger.info('connected to redis');
});

redisClient.on('error', error => {
  logger.info('redis error', error);
  process.exit(1);
});

module.exports = redisClient;
