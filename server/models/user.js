var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var userSchema = new Schema({
    id: ObjectId,
    date: {type: Date, default: Date.now},
    email: String,
    code: String // stop code
});
 
module.exports = mongoose.model('User', userSchema);