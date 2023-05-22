// Credit gsroudwhfj#3463
 
const { model, Schema } = require('mongoose');
 
let languageSchema = new Schema({
    Guild: String,
    Language: String,
});
 
module.exports = model("List language", languageSchema);