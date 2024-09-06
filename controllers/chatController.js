import Project from '../models/Project.js';
import MutationResult from '../models/MutationResult.js';
import Chat from '../models/Chat.js';
import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { assistantChat } from '../utils/openAiRequest.js';
import UnAuthenticatedError from '../errors/unauthenticated.js';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_SECRET_KEY,
});

const Startchat = async (req, res) => {
    const { mutationResult } = req.body;
    const projectId = req.params.id;

    try {
        const project = await MutationResult.findOne({_id: projectId});
        if (!project) {
            throw new UnAuthenticatedError('Project not found');
        }

        const assistantId = Project.chatAssistantId;
        const program = await MutationResult.find({projectId: projectId});
        const testcase = await MutationResult.find({projectId: projectId});
        const existingChat = await Chat.findOne({projectId: projectId});
        let chat;
        if (existingChat) {
            chat = existingChat;
        } else {
            const thread = await openai.beta.threads.create();
            chat = await Chat.create({
                chatAssistantId: assistantId,
                threadId: thread.id,
                user: req.user.userId,
                projectId: projectId
            });
        }
    const threadId = chat.threadId
     const chatResponse = await assistantChat(assistantId, program, testcase, mutationResult, threadId);
        chat.messages.push({ role: 'user', message: mutationResult });
        chat.messages.push({ role: 'assistant', message: chatResponse });
        await chat.save();
     res.status(StatusCodes.OK).json({'mutationResult' : mutationResult, 'assistant':chatResponse });

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error handling the chat', error: error.message });
        console.log(error);
    }
};

const getChatHistory = async(req,res) => {
    const projectId = req.params.id;
    const chatHistory = await Chat.findOne({projectId: projectId})
    if(chatHistory) {
        res.status(StatusCodes.OK).json({'messages': chatHistory.messages });
    }
}
export { Startchat, getChatHistory };
