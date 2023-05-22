const { model, Schema } = require('mongoose');
 
const announceSchema = new Schema({
    Guild: String,
    Channel: String,
})
 
module.exports = model('announce', announceSchema);