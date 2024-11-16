import mongoose, { Schema, Document } from 'mongoose';

const LikeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate likes
LikeSchema.index({ userId: 1, commentId: 1 }, { unique: true });

export default mongoose.model('Like', LikeSchema);
