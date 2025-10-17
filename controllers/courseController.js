const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Teacher
const createCourse = async (req, res) => {
  const { title, description, duration, price, rating } = req.body;

  try {
    const course = new Course({
      title,
      description,
      duration,
      price,
      rating,
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

// @desc    Enroll a student in a course
// @route   POST /api/courses/:id/enroll
// @access  Private/Student
const enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if the student is already enrolled
    const alreadyEnrolled = await Enrollment.findOne({
      course: req.params.id,
      student: req.user._id,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      course: req.params.id,
      student: req.user._id,
    });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get courses a student is enrolled in
// @route   GET /api/courses/my-courses
// @access  Private/Student
const getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
          path: 'course',
          populate: {
              path: 'teacher',
              select: 'name' // Only get the teacher's name
          }
      });
  
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get students enrolled in a specific course
// @route   GET /api/courses/:id/students
// @access  Private/Teacher
const getEnrolledStudents = async (req, res) => {
  try {
    const courseId = req.params.id;
    
    // First, check if the course exists and if the logged-in user is the teacher
    const course = await Course.findById(courseId);
    if (!course) {
        return res.status(404).json({ message: 'Course not found' });
    }

    if (course.teacher.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view students for this course' });
    }

    // If authorized, find all enrollments for that course
    const enrollments = await Enrollment.find({ course: courseId }).populate('student', 'name email');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {
  createCourse,
  getAllCourses,
  enrollInCourse,
  getMyCourses,
  getEnrolledStudents,
};