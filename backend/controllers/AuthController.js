const Manager = require('../models/ManagerModel');
const Staff = require('../models/StaffModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const generateToken = (id, role, type) => {
  return jwt.sign({ id, role, type }, JWT_SECRET, { expiresIn: '7d' });
};

// Login for managers
const loginManager = async (req, res) => {
  const { email, password } = req.body;

  try {
    const manager = await Manager.findOne({ email });
    if (!manager) return res.status(404).json({ message: 'Manager not found.' });

    if (manager.status !== 'accepted') {
      return res.status(403).json({ message: 'Manager not accepted yet or denied.' });
    }

    const isMatch = await bcrypt.compare(password, manager.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    const token = generateToken(manager._id, manager.teamName, 'manager');

    res.json({
      message: 'Manager login successful.',
      token,
      userType: 'manager',
      data: {
        id: manager._id,
        teamName: manager.teamName,
        managerName: manager.managerName,
        email: manager.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login for staff
const loginStaff = async (req, res) => {
  const { email, password } = req.body;

  try {
    const staff = await Staff.findOne({ email });
    if (!staff) return res.status(404).json({ message: 'Staff not found.' });

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    const token = generateToken(staff._id, staff.role, 'staff');

    res.json({
      message: 'Staff login successful.',
      token,
      userType: 'staff',
      data: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  loginManager,
  loginStaff
};
