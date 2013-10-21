var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var userSchema = new Schema({
    id: ObjectId,
    date: {type: Date, default: Date.now},
    email: String,
    code: String // stop code
});

userSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});
 
module.exports = mongoose.model('User', userSchema);