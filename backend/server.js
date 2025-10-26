// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import socialRoutes from './routes/socialRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import { chat, streamChat } from './controllers/chatController.js';
import { errorHandler } from './middleware/errorHandler.js';
import session from 'express-session';

dotenv.config();

// ensure DB connection first
await connectDB();

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// CORS - allow custom header x-api-key used by your client
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  })
);

// JSON body parsing
app.use(express.json({ limit: '10mb' }));

// Rate limiter for /api routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// optional: require OPENROUTER_API_KEY to be set (uncomment exit if you want to fail fast)
// if (!process.env.OPENROUTER_API_KEY) {
//   console.error('ERROR: OPENROUTER_API_KEY is not set in environment variables');
//   process.exit(1);
// }
if (!process.env.OPENROUTER_API_KEY) {
  console.warn('Warning: OPENROUTER_API_KEY is not set. Chat endpoints will fail until it is provided.');
}

// Mount API routers
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/auth/connect', socialRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/image', imageRoutes);
// console.log(app)

// Chat endpoints (non-streaming + streaming)
// Make sure controllers/chatController.js exports `chat` and `streamChat`
app.post('/api/chat', chat);
app.post('/api/chat/stream', streamChat);

// simple health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// error handler (last)
app.use(errorHandler);

// graceful shutdown
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

process.on('SIGINT', () => {
  console.log('SIGINT received — closing server');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
