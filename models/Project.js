import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, 'Please provide a title for this project'],
    },
    description: {
        type: String,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user'],
    },
    projectAssistantId: {
        type: String,
        required: [true, 'please provide assistant ID']
    },
    chatAssistantId: {
        type: String,
        required: [true, 'please provide assistant ID']
    }

},
{ timestamps: true }
)

export default mongoose.model('Project', ProjectSchema)