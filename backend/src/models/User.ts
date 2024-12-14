import mongoose from 'mongoose';

// Base interface for user data
export interface IUserBase {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  region?: string;
  createdAt: Date;
}

// Interface for user document with Mongoose _id
export interface IUser extends IUserBase {
  _id: mongoose.Types.ObjectId;
}

// Interface for Mongoose document
export interface IUserDocument extends mongoose.Document, IUserBase {
  _id: mongoose.Types.ObjectId;
}

const userSchema = new mongoose.Schema<IUserDocument>({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  region: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUserDocument>('User', userSchema); 