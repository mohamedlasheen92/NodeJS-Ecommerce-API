/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const { Schema, model } = mongoose

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Username is required']
  },
  slug: {
    type: String,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'Error : Duplicate email!'],
    lowercase: true,
  },
  phone: {
    type: String,
  },
  profileImage: {
    type: String
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'manager'],
    default: 'user'
  },
  passwordChangedAt: { type: Date },
  passwordResetCode: { type: String },
  passwordResetCodeVerified: { type: Boolean },
  passwordResetCodeExpiresAt: { type: Date },
  active: { type: Boolean, default: true }

}, { timestamps: true })

// Set full URL for profile image upon retrieve data
const setProfileImgURL = (doc) => {
  if (doc.profileImage) {
    const profileImageURL = `${process.env.BASE_URL}/users/${doc.profileImage}`
    doc.profileImage = profileImageURL
  }
}
userSchema.post('init', (doc) => {
  setProfileImgURL(doc)

})
userSchema.post('save', (doc) => {
  setProfileImgURL(doc)
})

// Hash the password before saving to the database
userSchema.pre('save', async function () {
  const currentDoc = this;
  if (currentDoc.isModified('password')) {
    currentDoc.password = await bcrypt.hash(currentDoc.password, Number(process.env.SALT_ROUNDS))
  }
})

// Compare the provided plain password with the stored hashed password
userSchema.methods.verifyPassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password)
}

const User = model('User', userSchema)

module.exports = User