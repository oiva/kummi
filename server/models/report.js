var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var reportSchema = new Schema({
    id: ObjectId,
    service_request_id: String,
    date: {type: Date, default: Date.now},
    description: String,
    service_code: String,
    lat: String,
    long: String,
    first_name: String,
    last_name: String,
    email: String,
    stop: ObjectId // referenced stop
});
 
module.exports = mongoose.model('Report', reportSchema);