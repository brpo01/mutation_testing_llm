import mongoose from 'mongoose';

const ProgramSchema = new mongoose.Schema(
    {
        program: {
            type: String,
            required: [true, 'please provide a program under test'],
        },
        testcase: {
            type: String,
            required: [true, 'please provide a corresponding test case'],
        },
        ProjectId: {
            type: mongoose.Types.ObjectId,
            ref: 'Project',
            required: [true, 'please provide the project ID']
        }
    }
)

export default mongoose.model('Program', ProgramSchema);