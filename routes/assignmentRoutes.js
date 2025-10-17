// routes/assignmentRoutes.js
const express = require('express');
const router = express.Router();
const {
    createAssignment,
    submitAssignment,
    getAssignmentSubmissions
} = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Route for a teacher to create a new assignment
router.route('/')
    .post(protect, authorize('Teacher'), createAssignment);

// Route for a student to submit their work
router.route('/:id/submit')
    .post(protect, authorize('Student'), submitAssignment);
    
// Route for a teacher to see all submissions for an assignment
router.route('/:id/submissions')
    .get(protect, authorize('Teacher'), getAssignmentSubmissions);

module.exports = router;