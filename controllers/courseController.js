const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Assignment = require('../models/Assignment');

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Teacher
const createCourse = async (req, res) => {
  const { title, description, duration, price, rating, materialUrl } = req.body;
  try {
    const course = new Course({
      title,
      description,
      duration,
      price,
      rating,
      materialUrl,
      teacher: req.user._id,
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
    const courses = await Course.find({}).populate('teacher', 'name email');
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
    const alreadyEnrolled = await Enrollment.findOne({ course: req.params.id, student: req.user._id });
    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }
    const enrollment = await Enrollment.create({ course: req.params.id, student: req.user._id });
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
          populate: { path: 'teacher', select: 'name' }
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
    const course = await Course.findById(courseId);
    if (!course) {
        return res.status(404).json({ message: 'Course not found' });
    }
    if (course.teacher.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view students for this course' });
    }
    const enrollments = await Enrollment.find({ course: courseId }).populate('student', 'name email');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all details (students & assignments) for a teacher's course
// @route   GET /api/courses/:id/details
// @access  Private/Teacher
const getCourseDetailsForTeacher = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        if (course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view details for this course' });
        }
        const [students, assignments] = await Promise.all([
            Enrollment.find({ course: courseId }).populate('student', 'name email'),
            Assignment.find({ course: courseId })
        ]);
        res.json({ students, assignments });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Update a course's material URL
// @route   PUT /api/courses/:id
// @access  Private/Teacher
const updateCourseMaterial = async (req, res) => {
    try {
        const { materialUrl } = req.body;
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        // Security Check: Ensure the logged-in user is the teacher of this course
        if (course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this course' });
        }
        course.materialUrl = materialUrl || course.materialUrl;
        const updatedCourse = await course.save();
        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = {
  createCourse,
  getAllCourses,
  enrollInCourse,
  getMyCourses,
  getEnrolledStudents,
  getCourseDetailsForTeacher,
  updateCourseMaterial,
};