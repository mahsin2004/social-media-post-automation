import mongoose from 'mongoose';
import { type } from 'os';

const postSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:     { type: String },
  caption:   { type: String },
  description:{ type: String },
  body:      { type: String },
  hashtags:  [String],
  platform: {type: String},
  imagePrompt: { type: String },
  imageUrl:  { type: String },
  status:    { type: String, enum: ['draft','scheduled','published'], default: 'draft' },
  scheduledAt:{ type: Date },
}, { timestamps: true });

export default mongoose.model('Post', postSchema);
