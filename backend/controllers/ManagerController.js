const Manager = require('../models/ManagerModel');

const requestManagerRole = async (req, res) => {
  try {
    // Check if the IP address is sent by the frontend
    let ipAddress = req.body.ipAddress || req.ip;

    // If the request is behind a proxy, get the real IP from the X-Forwarded-For header
    if (req.headers['x-forwarded-for'] && !req.body.ipAddress) {
      ipAddress = req.headers['x-forwarded-for'].split(',')[0]; // Take the first IP in the list
    }

    const newManager = new Manager({
      ...req.body,
      status: 'pending',
      ipAddress: ipAddress // Store the provided IP address
    });

    await newManager.save();
    res.status(201).json({ message: 'Manager request submitted.', data: newManager });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getManagerByIP = async (req, res) => {
  const { ipAddress } = req.params;

  try {
    const manager = await Manager.findOne({ ipAddress });

    if (manager) {
      return res.json(manager); // Return manager data if found
    }

    res.status(404).json({ message: 'No manager found for this IP address' }); // If no manager is found
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update manager status (with accepted limit check)
const updateManagerStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (status === 'accepted') {
      const acceptedCount = await Manager.countDocuments({ status: 'accepted' });
      if (acceptedCount >= 20) {
        return res.status(400).json({ message: 'Limit of 20 accepted managers reached.' });
      }
    }

    const updatedManager = await Manager.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedManager) {
      return res.status(404).json({ message: 'Manager not found.' });
    }

    res.json({ message: `Status updated to ${status}.`, data: updatedManager });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all managers
const getAllManagers = async (req, res) => {
  try {
    const managers = await Manager.find();
    res.json(managers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a manager
const deleteManager = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Manager.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Manager not found.' });
    }
    res.json({ message: 'Manager deleted.', data: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  requestManagerRole,
  updateManagerStatus,
  getManagerByIP,
  getAllManagers,
  deleteManager
};
