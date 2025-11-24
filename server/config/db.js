const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URL || process.env.MONGO_URI || 'mongodb://localhost:27017/healthy-gut-ai';
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
