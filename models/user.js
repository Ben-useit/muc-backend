const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name.'],
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: 6,
  },
  verificationToken: {
    type: String,
    required: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verified: {
    type: Date,
  },
});

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidate) {
  const isMatch = await bcrypt.compare(candidate, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
