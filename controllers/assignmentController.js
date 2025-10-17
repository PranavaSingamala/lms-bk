const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Create an assignment (MCQ Quiz) for a course
// @route   POST /api/assignments
// @access  Private/Teacher
exports.createAssignment = async (req, res) => {
    const { courseId, title, dueDate, questions } = req.body;

    try {
        // Security check: Verify the user is the teacher of the course
        const course = await Course.findById(courseId);
        if (!course || course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to add assignments to this course' });
        }

        const assignment = await Assignment.create({ 
            course: courseId, 
            title, 
            dueDate, 
            questions
        });
        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Submit answers for a quiz and auto-grade
// @route   POST /api/assignments/:id/submit
// @access  Private/Student
exports.submitAssignment = async (req, res) => {
    const { answers } = req.body; 
    const assignmentId = req.params.id;

    try {
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Security check: Verify the student is enrolled in the course
        const isEnrolled = await Enrollment.findOne({ course: assignment.course, student: req.user._id });
        if (!isEnrolled) {
            return res.status(403).json({ message: 'You are not enrolled in this course.' });
        }
        
        // --- Auto-grading logic ---
        let score = 0;
        for (let i = 0; i < assignment.questions.length; i++) {
            const question = assignment.questions[i];
            const studentAnswer = answers.find(a => a.questionText === question.questionText);

            if (studentAnswer && studentAnswer.selectedAnswer === question.correctAnswer) {
                score++;
            }
        }

        // Find if a submission already exists to update it
        let submission = await Submission.findOne({ assignment: assignmentId, student: req.user._id });

        if (submission) {
            submission.answers = answers;
            submission.score = score;
            submission.submittedAt = Date.now();
        } else {
            submission = new Submission({
                assignment: assignmentId,
                student: req.user._id,
                answers: answers,
                score: score,
            });
        }

        await submission.save();
        res.status(201).json({ message: 'Quiz submitted successfully!', submission });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Get all submissions for a specific assignment
// @route   GET /api/assignments/:id/submissions
// @access  Private/Teacher
exports.getAssignmentSubmissions = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id).populate('course');
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Security check: Verify the teacher owns the course
        if (assignment.course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view submissions for this assignment' });
        }

        const submissions = await Submission.find({ assignment: req.params.id }).populate('student', 'name email');
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};