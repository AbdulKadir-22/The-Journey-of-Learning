const express = require('express');
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require('../controllers/note.controller');

const router = express.Router();

router.route('/')
  .post(createNote)
  .get(getNotes);

router.route('/:id')
  .get(getNoteById)
  .put(updateNote)
  .delete(deleteNote);

module.exports = router;
