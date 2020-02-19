var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentsData = new Schema({
    userID: String,
    recipe_id: String,
    //privacy -> 0:public, 1:private
    commentsData: [{text: String, timeStamp: Date, commenterID: String, privacy: Number, isActive: Boolean }]
})

module.exports = mongoose.model('Comments', commentsData);