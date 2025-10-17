const mongoose =require('mongoose');

const AnswerSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    selectedAnswer: { type: String, required: true },
});

const SubmissionSchema = new mongoose.Schema({
    assignment: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Assignment', 
        required: true 
    },
    student: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    answers: [AnswerSchema], // <-- UPDATED
    score: { type: Number, default: 0 }, // <-- ADDED
    submittedAt: { 
        type: Date, 
        default: Date.now 
    },
});

module.exports = mongoose.model('Submission', SubmissionSchema);