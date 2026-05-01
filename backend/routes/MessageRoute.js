const express = require('express');
const router = express.Router();
const messageController = require('../controllers/MessageController');

// Send message
router.post('/send', messageController.sendMessage);

// Get all messages (staff/admin)
router.get('/all', messageController.getAllMessages);

// Get message counts
router.get('/counts', messageController.getMessageCounts);

// Get messages by sender
router.get('/sender/:senderType/:senderId', messageController.getMessagesBySender);

// Get single message
router.get('/:id', messageController.getMessageById);

// Reply to message
router.post('/:messageId/reply', messageController.replyToMessage);

// Update message status
router.put('/:messageId/status', messageController.updateMessageStatus);

module.exports = router;
