const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  enrollInCourse,
  getMyCourses,
  getEnrolledStudents
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

// BRONZE LEVEL ROUTES
// Anyone can get all courses, but only teachers can create a new one.
router.route('/')
  .get(getAllCourses)
  .post(protect, authorize('Teacher'), createCourse);

// SILVER LEVEL ROUTES
// Route for students to view the courses they are enrolled in.
router.get('/my-courses', protect, authorize('Student'), getMyCourses);

// Route for a student to enroll in a specific course by its ID.
router.post('/:id/enroll', protect, authorize('Student'), enrollInCourse);
  
// Route for a teacher to view the list of students in one of their courses.
router.get('/:id/students', protect, authorize('Teacher'), getEnrolledStudents);

module.exports = router;