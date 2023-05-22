const { model, Schema } = require('mongoose');
 
let mute = new Schema ({
    Guild: String,
    User: String,
    Time: Number
})
 
module.exports = model('mute', mute);