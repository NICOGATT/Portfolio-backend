const crypto = require('crypto');

// Protege los endpoints que llama n8n, que no tiene login de usuario.
const validarApiKeyN8n = (req, res, next) => {
    const apiKeyEsperada = process.env.N8N_API_KEY;

    if (!apiKeyEsperada) {
        return res.status(500).json({ message: 'N8N_API_KEY no configurada' });
    }

    const apiKeyRecibida = Buffer.from(req.get('x-api-key') || '');
    const apiKey = Buffer.from(apiKeyEsperada);

    if (apiKeyRecibida.length !== apiKey.length || !crypto.timingSafeEqual(apiKeyRecibida, apiKey)) {
        return res.status(401).json({ message: 'API key invalida' });
    }

    next();
};

module.exports = validarApiKeyN8n;
