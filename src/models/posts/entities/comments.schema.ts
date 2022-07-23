import mongoose from 'mongoose';

export const CommentsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      max: 300,
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true },
);
