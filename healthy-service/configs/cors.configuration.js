const parseOrigins = (raw) =>
    (raw || '')
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);

const allowedOrigins = parseOrigins(process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL);

export const corsOptions = {
    origin: (origin, callback) => {
        // Permite herramientas sin origin (health checks, Postman, servidor a servidor)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('No permitido por política CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-token']
};