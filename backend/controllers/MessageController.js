const Message = require('../models/MessageModel');
const Staff = require('../models/StaffModel');

// Send message (player or manager to staff)
exports.sendMessage = async (req, res) => {
  try {
    const { senderId, senderType, senderName, senderEmail, subject, message, category } = req.body;
    
    const newMessage = new Message({
      senderId,
      senderType,
      senderName,
      senderEmail,
      subject,
      message,
      category: category || 'general',
      status: 'open',
      priority: 'medium'
    });
    
    await newMessage.save();
    
    res.status(201).json({
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get all messages (for staff/admin)
exports.getAllMessages = async (req, res) => {
  try {
    const { status, priority, category, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    
    const messages = await Message.find(query)
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Message.countDocuments(query);
    
    res.json({
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Get messages by sender
exports.getMessagesBySender = async (req, res) => {
  try {
    const { senderId, senderType } = req.params;
    
    const messages = await Message.find({ senderId, senderType })
      .sort({ createdAt: -1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Get single message
exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('replies.staffId', 'name role')
      .populate('assignedTo', 'name role');
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch message' });
  }
};

// Reply to message (staff only)
exports.replyToMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { staffId, message } = req.body;
    
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    
    const msg = await Message.findById(messageId);
    if (!msg) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    msg.replies.push({
      staffId,
      staffName: staff.name,
      message,
      createdAt: new Date()
    });
    
    msg.status = 'in_progress';
    msg.updatedAt = new Date();
    
    await msg.save();
    
    res.json({
      message: 'Reply added',
      data: msg
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add reply' });
  }
};

// Update message status
exports.updateMessageStatus = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status, priority, assignedTo } = req.body;
    
    const updates = { updatedAt: new Date() };
    if (status) {
      updates.status = status;
      if (status === 'resolved') {
        updates.resolvedAt = new Date();
      }
    }
    if (priority) updates.priority = priority;
    if (assignedTo) updates.assignedTo = assignedTo;
    
    const message = await Message.findByIdAndUpdate(
      messageId,
      { $set: updates },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json({
      message: 'Status updated',
      data: message
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};

// Get message counts for dashboard
exports.getMessageCounts = async (req, res) => {
  try {
    const openCount = await Message.countDocuments({ status: 'open' });
    const inProgressCount = await Message.countDocuments({ status: 'in_progress' });
    const resolvedCount = await Message.countDocuments({ status: 'resolved' });
    const urgentCount = await Message.countDocuments({ priority: 'urgent', status: { $ne: 'resolved' } });
    
    res.json({
      open: openCount,
      inProgress: inProgressCount,
      resolved: resolvedCount,
      urgent: urgentCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get counts' });
  }
};
