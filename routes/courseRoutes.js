const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  enrollInCourse,
  getMyCourses,
  getEnrolledStudents
} = require('../controllers/courseController');
const { getCourseAssignments } = require('../controllers/assignmentController'); // <-- IMPORT NEW FUNCTION
const { protect, authorize } = require('../middleware/authMiddleware');

// BRONZE LEVEL ROUTES
router.route('/')
  .get(getAllCourses)
  .post(protect, authorize('Teacher'), createCourse);

// SILVER LEVEL ROUTES
router.get('/my-courses', protect, authorize('Student'), getMyCourses);
router.post('/:id/enroll', protect, authorize('Student'), enrollInCourse);
router.get('/:id/students', protect, authorize('Teacher'), getEnrolledStudents);

// --- NEW GOLD LEVEL ROUTE ---
// Get all assignments for a specific course (for enrolled students)
router.get('/:courseId/assignments', protect, authorize('Student'), getCourseAssignments);

module.exports = router;