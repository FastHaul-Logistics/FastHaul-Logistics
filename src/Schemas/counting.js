const { model, Schema } = require('mongoose');
 
let countschema = new Schema ({
    Guild: String,
    Channel: String,
    Count: Number
})
 
module.exports = model('countschema', countschema);