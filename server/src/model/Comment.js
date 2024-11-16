import mongoose, { Schema, Document } from 'mongoose';

const CommentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    level: {
      type: Number,
      default: 0,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
CommentSchema.index({ parentId: 1 });
CommentSchema.index({ author: 1 });
CommentSchema.index({ createdAt: -1 });

export default mongoose.model('Comment', CommentSchema);
