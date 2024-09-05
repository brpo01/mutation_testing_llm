import mongoose from "mongoose";

const MutationResultSchema = new mongoose.Schema({
    result: {
        type: String,
        required: [true, 'please provide mutation testing result']
    },
    newTestSuite: {
        type: String,
        required: [true, 'please provide new test cases']
    },
    program: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'Program',
        },
    ],
      ProjectId: {
        type: mongoose.Types.ObjectId,
        ref: 'Project',
        required: [true, 'please provide the project ID'],
    },
      user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'please provide the user ID'],
    },
 });

export default mongoose.model('MutationResult', MutationResultSchema);
