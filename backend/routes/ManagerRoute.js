const express = require('express');
const router = express.Router();
const {
  requestManagerRole,
  updateManagerStatus,
  getAllManagers,
  getManagerByIP,
  deleteManager
} = require('../controllers/ManagerController');

// Request to become a manager (status: pending)
router.post('/request', requestManagerRole);

// Change status of a manager
router.put('/status/:id', updateManagerStatus);

router.get('/ip/:ipAddress', getManagerByIP);

// Get all managers
router.get('/', getAllManagers);

// Delete a manager
router.delete('/:id', deleteManager);

module.exports = router;
