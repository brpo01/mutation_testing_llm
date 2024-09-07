import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';
dotenv.config();
import Project from '../models/Project.js';
import Program from '../models/Program.js';
import UnAuthenticatedError from '../errors/unauthenticated.js';
import {
  processProgram,
  createProjectAssistant,
  createChatAssistant,
} from '../utils/openAiRequest.js';
import MutationResult from '../models/MutationResult.js';
import Chat from '../models/Chat.js';

const createProject = async (req, res) => {
  const { title, description } = req.body;
  const user = req.user.userId;
  if (!title || !description)
    throw new UnAuthenticatedError('please enter all field');
  const projectAssistantId = await createProjectAssistant();
  const chatAssistantId = await createChatAssistant();
  const project = await Project.create({
    title,
    description,
    user,
    projectAssistantId,
    chatAssistantId,
  });
  res.status(StatusCodes.CREATED).json({
    message: 'Project Created sucessfully',
    id: project.id,
    title: project.title,
    description: project.description,
    assistantId: project.assistantId,
  });
};

const allProject = async (req, res) => {
  const project = await Project.find({
    user: req.user.userId,
  });
  res
    .status(StatusCodes.OK)
    .json({ message: 'successfull', data: project });
};

const getProject = async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.id,
  });
  res.status(StatusCodes.OK).json({
    title: project.title,
    description: project.description,
    assistantId: project.assistantId,
  });
};

const deleteProject = async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.id,
  });

  if (!project) {
    throw new NotFoundError(`No Project with id :${req.params.id}`);
  }

  await Project.deleteOne({ _id: req.params.id });
  await Program.deleteOne({ projectId: req.params.id });
  await MutationResult.deleteMany({ projectId: req.params.id });

  res
    .status(StatusCodes.OK)
    .json({ message: 'Success! Project removed' });
};

const updateProject = async (req, res) => {
  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    req.body
  );
  res.status(StatusCodes.OK).json({
    message: 'project edited successfully',
    id: updatedProject.id,
  });
};


import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import Project from '../models/Project.js';
import Program from '../models/Program.js';
import UnAuthenticatedError from '../errors/unauthenticated.js';
import filterScholarresponse from '../utils/filterScholarResponse.js';
import {
  processProgram,
  createProjectAssistant,
  createChatAssistant,
} from '../utils/openAiRequest.js';
import MutationResult from '../models/MutationResult.js';
import Chat from '../models/Chat.js';

const createProgram = async (req, res) => {
  const { program, testcase, projectId } = req.body;

  // Check for required fields
  if (!program || !testcase || !projectId) {
    throw new UnAuthenticatedError('Please enter all fields');
  }

  try {
    // Decode Base64 encoded program and testcase
    const decodedProgram = Buffer.from(program, 'base64').toString('utf-8');
    const decodedTestcase = Buffer.from(testcase, 'base64').toString('utf-8');

    // Find the project by ID
    const project = await Project.findOne({ _id: projectId });

    if (!project) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Project not found' });
    }

    // Create a new program document and save it
    const newProgram = await Program.create({
      program: decodedProgram,
      testcase: decodedTestcase,
      projectId
    });

    // Process the program with OpenAI
    const openAiResponse = await processProgram(
      project.projectAssistantId,
      decodedProgram,
      decodedTestcase
    );

    // Check if OpenAI response is 'Yes'
    if (openAiResponse === 'Yes') {
      const mutationResult = await MutationResult.create({
        result: openAiResponse,
        newTestSuite: "New test cases to be added", // Assuming you will generate or specify this value
        program: newProgram._id,
        projectId: project._id,
        user: req.user.userId,
      });

      return res.status(StatusCodes.OK).json({
        message: 'Mutation result created successfully',
        data: mutationResult,
      });
    } else {
      return res.status(StatusCodes.OK).json({
        message: 'Program did not meet the criteria for mutation result creation',
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Error: Something went wrong' });
  }
};

const allProgram = async (req, res) => {
  const program = await Program.find({
    projectId: req.params.id,
  });
  res
    .status(StatusCodes.OK)
    .json({ message: 'successfull', data: program });
};

const deleteProgram = async (req, res) => {
  const program = await Program.findOne({
    _id: req.params.id,
  });
  if (!program) {
    throw new NotFoundError(`No program under test with id :${req.params.id}`);
  }

  await program.deleteOne({ _id: req.params.id });
  await MutationResult.deleteMany({ filterQuery: req.params.id });
  await Chat.deleteOne({ user: req.user.userId });

  res
    .status(StatusCodes.OK)
    .json({ message: 'Success! Program under test successfully removed' });
};


const getAllMutationResults = async (req, res) => {
  const mutationResult = await MutationResult.find({
    projectId: req.params.id,
  });
  res
    .status(StatusCodes.OK)
    .json({ message: 'successfull', data: mutationResult });
};

export {
  createProject,
  allProject,
  getProject,
  createProgram,
  deleteProgram,
  updateProject,
  allProgram,
  deleteProject,
  getAllMutationResults,
};
