const logger = (req, res, next) => {
  const start = Date.now();
  const port = process.env.PORT || 3000;
  const originalSend = res.send;

  let responseBody;

  const maskSensitiveFields = (obj, keysToMask = ['password']) => {
    if (!obj) return obj;
    const masked = { ...obj };
    for (const key of keysToMask) {
      if (key in masked) masked[key] = '************';
    }
    return masked;
  };

  res.send = function (body) {
    responseBody = body;
    res.send = originalSend;
    return res.send(body);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;

    console.log(`[${new Date().toISOString()}] | Port ${port} | ${req.method} ${req.originalUrl}`);
    console.log('Request Params:', req.params);
    console.log('Request Query :', req.query);
    console.log('Request Body  :', maskSensitiveFields(req.body)); // 👈 pakai masker

    if (responseBody) {
      try {
        const parsedBody = typeof responseBody === 'string' ? JSON.parse(responseBody) : responseBody;
        console.log('Response Body :', parsedBody);
      } catch (e) {
        console.log('Response Body :', responseBody);
      }
    }

    console.log(`Response Status: ${res.statusCode} | Duration: ${duration}ms\n`);
  });

  next();
};


module.exports = logger;
