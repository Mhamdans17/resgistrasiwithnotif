require('dotenv').config();
const { createClient } = require('redis');

const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';
console.log('Connecting to Redis at:', redisUrl);

const redisClient = createClient({ url: redisUrl });

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
