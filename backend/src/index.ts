import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import pollRoutes from './routes/poll.routes';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Middleware to attach the socket.io instance to the request object
app.use((req, res, next) => {
  (req as any).io = io;
  next();
});

// Routes
app.use('/api/polls', pollRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('poll-created', (data) => {
    io.emit('poll-created', data);
  });

  socket.on('vote', (data) => {
    io.emit('vote-update', data);
  });

  socket.on('like', (data) => {
    io.emit('like-update', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});