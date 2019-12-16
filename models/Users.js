var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userData = new Schema({
    userName: String,
    email: String,
    password: String,
    location: String,
    gender: String,
    mobile: String,
    verificationCode: String,
    isVerified: {type: Boolean, default: false},
    passwordResetCode: String,
    passwordExpiryDate: Date,
    likes: [String],
    favourites: [String],
    dislikes: [String]
});

module.exports = mongoose.model('Users', userData);