import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    username: {
      type: String,
      required: true,
      min: 2,
      max: 100,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 255,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    coverPicture: {
      type: String,
      default: '',
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      max: 200,
      default: '',
    },
    emblems: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true },
);
