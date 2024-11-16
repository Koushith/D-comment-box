import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './libs/database.js';
import commentRoutes from './routes/commentRoutes.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/comments', commentRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
