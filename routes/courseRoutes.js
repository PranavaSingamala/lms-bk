const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  enrollInCourse,
  getMyCourses,
  getEnrolledStudents
} = require('../controllers/courseController');
const { getCourseAssignments } = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// BRONZE LEVEL ROUTES
router.route('/')
  .get(getAllCourses)
  .post(protect, authorize('Teacher'), createCourse);

// SILVER LEVEL ROUTES
router.get('/my-courses', protect, authorize('Student'), getMyCourses);
router.post('/:id/enroll', protect, authorize('Student'), enrollInCourse);
router.get('/:id/students', protect, authorize('Teacher'), getEnrolledStudents);

// GOLD LEVEL ROUTE
// Get all assignments for a specific course (now for teachers OR students)
router.get('/:courseId/assignments', protect, getCourseAssignments);

module.exports = router;