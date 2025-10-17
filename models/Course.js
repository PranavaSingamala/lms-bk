const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, required: true, default: 0 },
  rating: { type: Number, default: 0 },
  materialUrl: { type: String }, // <-- ADD THIS LINE
});

module.exports = mongoose.model('Course', CourseSchema);