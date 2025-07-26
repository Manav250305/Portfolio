import mongoose from 'mongoose';
import connectDB from '../lib/utils/connectDB';

export default async function handler(req, res) {
  await connectDB();

  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
}