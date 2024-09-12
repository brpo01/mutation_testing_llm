import express from 'express';
import {
  createProject,
  allProject,
  getProject,
  createProgram,
  deleteProgram,
  updateProject,
  allProgram,
  deleteProject,
  getAllMutationResults,
} from '../controllers/programController.js';

const router = express.Router();

router.route('/create').post(createProject);
router.route('/all').get(allProject);
router
  .route('/:id')
  .get(getProject)
  .delete(deleteProject)
  .patch(updateProject);
router.route('/program/create').post(createProgram);
router.route('/program/:id').delete(deleteProgram);
router.route('/program/all/:id').get(allProgram);
router.route('/mutation-result/:id').get(getAllMutationResults);

export default router;
