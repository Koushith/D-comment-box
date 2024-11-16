import mongoose, { Schema, Document } from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    avatar: {
      type: String,
      default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // Start of Selection
    proofs: {
      type: [
        {
          url: {
            type: String,
          },
          type: {
            type: String,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', UserSchema);
