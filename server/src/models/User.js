const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'super_admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: ''
  },
  // Astrologer Profile
  profile: {
    professionalName: { type: String, trim: true },
    gender: { type: String, enum: ['male', 'female', 'other', ''] },
    dateOfBirth: Date,
    location: { type: String, trim: true },
    languages: [String],
    experience: { type: Number, default: 0 },
    astrologyType: [String],
    specializations: [String],
    qualifications: [String],
    certifications: [String],
    about: { type: String, maxlength: 5000 },
    shortBio: { type: String, maxlength: 500 },
    whatsapp: String,
    address: String,
    // Social Links
    social: {
      instagram: String,
      facebook: String,
      youtube: String,
      linkedin: String,
      twitter: String
    }
  },
  // Onboarding
  onboardingStep: {
    type: Number,
    default: 1
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  profileCompletion: {
    type: Number,
    default: 0
  },
  // Account Status
  status: {
    type: String,
    enum: ['active', 'suspended', 'pending', 'deactivated'],
    default: 'active'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastLogin: Date,
  loginCount: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ createdAt: -1 });

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Calculate profile completion
userSchema.methods.calculateProfileCompletion = function() {
  const fields = [
    this.name,
    this.email,
    this.phone,
    this.avatar,
    this.profile?.professionalName,
    this.profile?.dateOfBirth,
    this.profile?.location,
    this.profile?.languages?.length > 0,
    this.profile?.experience,
    this.profile?.astrologyType?.length > 0,
    this.profile?.specializations?.length > 0,
    this.profile?.about,
    this.profile?.shortBio,
    this.profile?.whatsapp,
    this.profile?.address,
    this.profile?.social?.instagram || this.profile?.social?.facebook
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
};

// Generate password reset token
userSchema.methods.generateResetToken = function() {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
