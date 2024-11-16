import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI ||
        'mongodb+srv://test_db_admin:ur64Rwuoh9h31HWa@test-i.0qbjxom.mongodb.net/dcomments?retryWrites=true&w=majority&appName=test-i'
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
