var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var reportSchema = new Schema({
    service_request_id: ObjectId,
    date: {type: Date, default: Date.now},
    author: {type: String, default: 'Anon'},
    description: String,
    service_code: Number,
    lat: Number,
    lon: Number,
    code: String // stop code
});
 
module.exports = mongoose.model('Report', reportSchema);