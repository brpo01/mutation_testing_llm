import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    role: { type: String, required: true }, // 'user' or 'assistant'
    message: { type: String },
    timestamp: { type: Date, default: Date.now }
});

const ChatSchema = new mongoose.Schema({
    chatAssistantId: {
        type: String,
        required: [true, 'please provide assistant ID']
    },
    threadId: {
        type: String,
        required: [true, 'please provide thread ID']
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    },
    projectId: {
        type: mongoose.Types.ObjectId,
        ref: 'Project',
        required: [true, 'please provide the project ID']
    },
    messages: [MessageSchema]
}, {
    timestamps: true
});

export default mongoose.model('Chat', ChatSchema);
