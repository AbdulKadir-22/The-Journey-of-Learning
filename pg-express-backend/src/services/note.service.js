const prisma = require('../config/db');

/**
 * Creates a new note
 */
const createNote = async (data) => {
  return await prisma.note.create({
    data,
  });
};

/**
 * Retrieves all notes, with optional search by title and tags
 */
const getAllNotes = async (searchTerm, tag) => {
  const whereClause = {};

  if (searchTerm) {
    whereClause.title = {
      contains: searchTerm,
      mode: 'insensitive', // PostgreSQL specific: case-insensitive search
    };
  }

  if (tag) {
    whereClause.tags = {
      has: tag, // PostgreSQL Array mapping in Prisma
    };
  }

  return await prisma.note.findMany({
    where: whereClause,
    orderBy: {
      createdAt: 'desc',
    },
  });
};

/**
 * Retrieves a single note by ID
 */
const getNoteById = async (id) => {
  return await prisma.note.findUnique({
    where: { id: parseInt(id) },
  });
};

/**
 * Updates a note by ID
 */
const updateNote = async (id, data) => {
  return await prisma.note.update({
    where: { id: parseInt(id) },
    data,
  });
};

/**
 * Deletes a note by ID
 */
const deleteNote = async (id) => {
  return await prisma.note.delete({
    where: { id: parseInt(id) },
  });
};

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
