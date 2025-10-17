const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
});

const AssignmentSchema = new mongoose.Schema({
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  dueDate: { 
    type: Date 
  },
  questions: [QuestionSchema], // <-- ADD THIS
});

module.exports = mongoose.model('Assignment', AssignmentSchema);    