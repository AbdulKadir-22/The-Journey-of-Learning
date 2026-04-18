const express = require('express');
const noteRoutes = require('./note.routes');

const router = express.Router();

// Mount note routes under /api/notes
router.use('/notes', noteRoutes);

module.exports = router;
