const { v4: uuidv4 } = require('uuid');

const logger = (req, res, next) => {
    const start = Date.now();
    const port = process.env.PORT || 3000;
    const originalSend = res.send;
    let responseBody;

    // Ambil dari header atau generate baru
    const correlationId = req.headers['x-correlation-id'] || uuidv4();
    res.setHeader('X-Correlation-ID', correlationId);

    const maskSensitiveFields = (obj, keysToMask = ['password', 'token']) => {
        if (!obj || typeof obj !== 'object') return obj;

        const masked = Array.isArray(obj) ? [...obj] : { ...obj };

        for (const key in masked) {
            if (!Object.prototype.hasOwnProperty.call(masked, key)) continue;

            const value = masked[key];

            if (keysToMask.includes(key)) {
                if (typeof value === 'string' && key === 'token') {
                    masked[key] = `${value.slice(0, 10)}...${value.slice(-5)}`;
                } else {
                    masked[key] = '************';
                }
            } else if (typeof value === 'object' && value !== null) {
                masked[key] = maskSensitiveFields(value, keysToMask);
            }
        }

        return masked;
    };

    res.send = function (body) {
        responseBody = body;
        return originalSend.call(this, body);
    };


    console.log(`\n=== REQUEST START === | Correlation ID: ${correlationId}`);
    console.log(`[${new Date().toISOString()}] | Port ${port} | ${req.method} ${req.originalUrl}`);
    console.log('Request Body  :', JSON.stringify(maskSensitiveFields(req.body)));

    res.on('finish', () => {
        const duration = Date.now() - start;

        console.log(`=== REQUEST FINISH === | Correlation ID: ${correlationId}`);
        if (responseBody) {
            try {
                const parsedBody = typeof responseBody === 'string' ? JSON.parse(responseBody) : responseBody;
                console.log('Response Body :', JSON.stringify(maskSensitiveFields(parsedBody)));
            } catch (e) {
                console.log('Response Body :', responseBody);
            }
        }
        console.log(`Response Status: ${res.statusCode} | Duration: ${duration}ms\n`);
    });

    next();
};

module.exports = logger;
