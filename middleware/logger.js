const { v4: uuidv4 } = require('uuid');

const logger = (req, res, next) => {
    const start = Date.now();
    const port = process.env.PORT || 3000;
    const originalSend = res.send;
    let responseBody;

    // Ambil dari header atau generate baru
    const correlationId = req.headers['x-correlation-id'] || uuidv4();
    res.setHeader('X-Correlation-ID', correlationId);

    // Helper logging dengan level
    const log = (level, message) => {
        const timestamp = new Date().toISOString();
        console.log(`${timestamp} | ${level.toUpperCase()} | ${message}`);
    };

    const maskSensitiveFields = (obj, keysToMask = ['password', 'token', 'resetToken']) => {
        if (!obj || typeof obj !== 'object') return obj;

        const masked = Array.isArray(obj) ? [...obj] : { ...obj };

        for (const key in masked) {
            if (!Object.prototype.hasOwnProperty.call(masked, key)) continue;

            const value = masked[key];

            if (keysToMask.includes(key)) {
                const partialMaskKey = ['resetToken', 'token'];

                if (typeof value === 'string' && partialMaskKey.includes(key)) {
                    masked[key] = `${value.slice(0, 10)}...${value.slice(-5)}`;
                } else {
                    masked[key] = '***INI PASSWORD***';
                }
            } else if (typeof value === 'object' && value !== null) {
                masked[key] = maskSensitiveFields(value, keysToMask);
            }
        }

        return masked;
    };

    // Override res.send
    res.send = function (body) {
        responseBody = body;
        return originalSend.call(this, body);
    };

    // Logging request
    log('info', `== START REQUEST == | Correlation ID: ${correlationId}`);
    log('info', `Port ${port} | ${req.method} ${req.originalUrl}`);
    log('info', `Request Body  : ${JSON.stringify(maskSensitiveFields(req.body))}`);

    res.on('finish', () => {
        const duration = Date.now() - start;

        if (responseBody) {
            try {
                const parsedBody = typeof responseBody === 'string' ? JSON.parse(responseBody) : responseBody;
                const masked = JSON.stringify(maskSensitiveFields(parsedBody));

                if (res.statusCode >= 400) {
                    log('error', `Response Body : ${masked}`);
                } else {
                    log('info', `Response Body : ${masked}`);
                }
            } catch (e) {
                log('error', `Response Body (raw): ${responseBody}`);
            }
        }

        const level = res.statusCode >= 400 ? 'error' : 'info';
        log(level, `Response Status: ${res.statusCode} | Duration: ${duration}ms`);
        log(level, `== FINISH REQUEST == | Correlation ID: ${correlationId}\n`);
    });

    next();
};

module.exports = logger;
