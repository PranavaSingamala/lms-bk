const express = require('express');
const router = express.Router();
const { createCourse, getAllCourses } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, authorize('Teacher'), createCourse) // Only authenticated teachers can create
  .get(getAllCourses); // Anyone can view the list of courses

module.exports = router;