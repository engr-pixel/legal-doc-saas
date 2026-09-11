import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'express-cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import redis from 'redis';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes';
import documentRoutes from './routes/document.routes';
import templateRoutes from './routes/template.routes';
import userRoutes from './routes/user.routes';
import paymentRoutes from './routes/payment.routes';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

// Initialize Prisma
export const prisma = new PrismaClient();

// Initialize Redis
const redisClient = redis.createClient({ url: process.env.REDIS_URL });
redisClient.on('error', (err) => console.error('Redis Error', err));
redisClient.connect().catch(console.error);

// Create Express app
const app: Express = express();
const server = http.createServer(app);

// Socket.IO initialization
export const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Export Redis client
export { redisClient };

// Middleware - Security
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));

// Middleware - Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Middleware - Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Middleware - Request Logger
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Error Handler Middleware
app.use(errorHandler);

// Socket.IO events
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Document collaboration events
  socket.on('document:open', (documentId: string) => {
    socket.join(`document:${documentId}`);
    socket.broadcast.to(`document:${documentId}`).emit('user:joined', {
      userId: socket.id,
      timestamp: new Date(),
    });
  });

  socket.on('document:edit', (data: any) => {
    socket.broadcast.to(`document:${data.documentId}`).emit('document:updated', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

export default app;
export { server };
