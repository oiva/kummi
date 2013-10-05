var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var reportSchema = new Schema({
    service_request_id: ObjectId,
    date: {type: Date, default: Date.now},
    description: String,
    service_code: String,
    lat: String,
    lon: String,
    code: String // stop code
});
 
module.exports = mongoose.model('Report', reportSchema);