const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  work: { type: String, required: true },
  socialLinks: [{ type: String }],
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

staffSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Staff = mongoose.model('Staff', staffSchema);
module.exports = Staff;
