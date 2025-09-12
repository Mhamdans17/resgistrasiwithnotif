require('dotenv').config();
const { createClient } = require('redis');

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
console.log('Connecting to Redis at:', redisUrl);

const redisClient = createClient({ url: redisUrl });

redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err.message);
});

/**
 * @param {number} retries
 * @param {number} delay
 */
async function connectWithRetry(retries = 5, delay = 2000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await redisClient.connect();
            console.log('Redis connected successfully');
            return;
        } catch (err) {
            console.error(
                `Redis connect attempt ${attempt} failed: ${err.message}`
            );

            if (attempt < retries) {
                console.log(`🔄 Retrying in ${delay / 1000} seconds...`);
                await new Promise((res) => setTimeout(res, delay));
            } else {
                console.error('Could not connect to Redis after retries');
                process.exit(1);
            }
        }
    }
}

connectWithRetry();

module.exports = redisClient;
