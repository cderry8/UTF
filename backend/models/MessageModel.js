const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Sender info
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'senderType'
  },
  senderType: {
    type: String,
    enum: ['Manager', 'PlayerUser', 'Staff'],
    required: true
  },
  senderName: { type: String, required: true },
  senderEmail: { type: String, required: true },
  
  // Message details
  subject: {
    type: String,
    required: true,
    maxLength: 200
  },
  message: {
    type: String,
    required: true,
    maxLength: 2000
  },
  category: {
    type: String,
    enum: ['complaint', 'suggestion', 'bug_report', 'general', 'appeal'],
    default: 'general'
  },
  
  // Status
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Replies from staff
  replies: [{
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
    staffName: { type: String },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Assigned staff
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    default: null
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
});

// Index for faster queries
messageSchema.index({ status: 1, priority: -1, createdAt: -1 });
messageSchema.index({ senderId: 1, senderType: 1 });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
