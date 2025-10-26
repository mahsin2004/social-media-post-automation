import mongoose from 'mongoose';

const socialAccountSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platform:     { type: String, enum: ['facebook','instagram','linkedin','twitter'], required: true },
  accountId:    { type: String, required: true },
  accessToken:  { type: String, required: true },
  refreshToken: { type: String },
  expiresAt:    { type: Date },
  scopes:       [String],
  connectedAt:  { type: Date, default: Date.now },
  status:       { type: String, enum: ['connected','disconnected','expired'], default: 'connected' },
}, { timestamps: true });

export default mongoose.model('SocialAccount', socialAccountSchema);
