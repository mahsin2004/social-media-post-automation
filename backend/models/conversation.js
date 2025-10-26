import mongoose from 'mongoose';
const messageSchema = new mongoose.Schema({ role: String, content: String }, { timestamps: true });
const conversationSchema = new mongoose.Schema({ sessionId: { type: String, unique: true }, messages: [messageSchema] }, { timestamps: true });
export const Conversation = mongoose.model('Conversation', conversationSchema);