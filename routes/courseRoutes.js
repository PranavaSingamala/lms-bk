const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  enrollInCourse,
  getMyCourses,
  getEnrolledStudents,
  getCourseDetailsForTeacher,
  updateCourseMaterial
} = require('../controllers/courseController');
const { getCourseAssignments } = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Base routes for getting all courses or creating a new one
router.route('/')
  .get(getAllCourses)
  .post(protect, authorize('Teacher'), createCourse);
  
// Route for a teacher to get combined details for their dashboard
router.route('/:id/details')
  .get(protect, authorize('Teacher'), getCourseDetailsForTeacher);

// Route for a teacher to update a course
router.route('/:id')
  .put(protect, authorize('Teacher'), updateCourseMaterial);

// Routes for student-specific actions
router.get('/my-courses', protect, authorize('Student'), getMyCourses);
router.post('/:id/enroll', protect, authorize('Student'), enrollInCourse);

// Route for a teacher to see students in their course
router.get('/:id/students', protect, authorize('Teacher'), getEnrolledStudents);

// Route for getting assignments for a specific course (for teachers OR students)
router.get('/:courseId/assignments', protect, getCourseAssignments);

module.exports = router;