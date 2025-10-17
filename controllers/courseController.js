 const Course = require('../models/Course');

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Teacher
const createCourse = async (req, res) => {
  const { title, description, duration } = req.body;

  try {
    const course = new Course({
      title,
      description,
      duration,
      teacher: req.user._id, // The user ID comes from the 'protect' middleware
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(400).json({ message: 'Course creation failed', error: error.message });
  }
};

// @desc    Get all available courses
// @route   GET /api/courses
// @access  Public
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).populate('teacher', 'name email'); // Show teacher name/email
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createCourse, getAllCourses };