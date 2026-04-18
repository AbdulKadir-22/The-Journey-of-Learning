const noteService = require('../services/note.service');

// @desc    Create a new note
// @route   POST /api/notes
const createNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const newNote = await noteService.createNote({
      title,
      content,
      tags: tags || [],
    });

    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
};

// @desc    Get all notes (handles search by title and tag)
// @route   GET /api/notes
const getNotes = async (req, res) => {
  try {
    const { search, tag } = req.query;
    const notes = await noteService.getAllNotes(search, tag);
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

// @desc    Get a single note by ID
// @route   GET /api/notes/:id
const getNoteById = async (req, res) => {
  try {
    const note = await noteService.getNoteById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.status(200).json(note);
  } catch (error) {
    console.error('Error fetching note by id:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
const updateNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const updatedNote = await noteService.updateNote(req.params.id, {
      title,
      content,
      tags,
    });
    res.status(200).json(updatedNote);
  } catch (error) {
    // If the error code indicates record to update not found
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Note not found' });
    }
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  try {
    await noteService.deleteNote(req.params.id);
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Note not found' });
    }
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
