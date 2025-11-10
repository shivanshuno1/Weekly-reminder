import express from 'express';
import { 
  getNotes, 
  createNote, 
  updateNote, 
  deleteNote 
} from '../controllers/notesController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); // All note routes are protected

router.route('/')
  .get(getNotes)
  .post(createNote);

router.route('/:id')
  .put(updateNote)
  .delete(deleteNote);

export default router;