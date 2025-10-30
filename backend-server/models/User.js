const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String
  },
  emailVerificationExpires: {
    type: Date
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpires: {
    type: Date
  },
  activeSessions: [{
    token: String,
    device: String,
    ip: String,
    lastActivity: Date,
    createdAt: Date
  }],
  // Akademik Profil Bilgileri
  department: {
    type: String,
    trim: true,
    maxlength: [100, 'Department cannot be more than 100 characters']
  },
  year: {
    type: String,
    enum: ['1', '2', '3', '4', '5', '6', 'Yüksek Lisans', 'Doktora', 'Mezun']
  },
  studentNumber: {
    type: String,
    trim: true,
    maxlength: [50, 'Student number cannot be more than 50 characters']
  },
  graduationYear: {
    type: String,
    trim: true
  },
  biography: {
    type: String,
    maxlength: [500, 'Biography cannot be more than 500 characters']
  },
  interests: [{
    type: String,
    trim: true
  }],
  // Gizlilik Ayarları
  privacy: {
    profileVisibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'public'
    },
    emailVisibility: {
      type: Boolean,
      default: false
    },
    showActivity: {
      type: Boolean,
      default: true
    }
  },
  // Rozetler ve Başarılar
  badges: [{
    badgeId: String,
    badgeName: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  level: {
    type: Number,
    default: 1
  },
  points: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);

