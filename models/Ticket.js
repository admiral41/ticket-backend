const mongoose = require('mongoose');
const { TICKET_STATUS, PRIORITY_LEVEL } = require('../utils/constants');

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: Object.values(TICKET_STATUS),
    default: TICKET_STATUS.OPEN
  },
  priority: {
    type: String,
    enum: Object.values(PRIORITY_LEVEL),
    default: PRIORITY_LEVEL.MEDIUM
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update the updatedAt field before saving
ticketSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
ticketSchema.index({ status: 1, priority: -1, createdAt: -1 });

module.exports = mongoose.model('Ticket', ticketSchema);