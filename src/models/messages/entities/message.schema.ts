import mongoose from 'mongoose';

export const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      max: 500,
    },
  },
  { timestamps: true },
);
