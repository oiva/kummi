var findOrCreate = require('mongoose-findorcreate')
   ,mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

 
var stopSchema = new Schema({
  id: ObjectId,
  date: {type: Date, default: Date.now},
  code: String,
  name_fi: String,
  name_sv: String,
  city_fi: String,
  city_sv: String,
  coords: String,
  code_short: String,
  address_fi: String,
  address_sv: String,
  has_display: Boolean
});

stopSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

stopSchema.plugin(findOrCreate);
 
module.exports = mongoose.model('Stop', stopSchema);