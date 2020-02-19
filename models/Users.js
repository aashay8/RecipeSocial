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
    isVerified: { type: Boolean, default: false },
    passwordResetCode: String,
    passwordExpiryDate: Date,
    likes: [String],
    favourites: [String],
    dislikes: [String],
    // commentsList: [{
    //     recipe_id: String,
    //     comments: [{ userId: String, text: String, timeStamp: Date, privacy: Number }]
    // }],
    friendsList: [String],
    sentRequestList: [String],
    pendingRequestList: [String]
});

module.exports = mongoose.model('Users', userData);