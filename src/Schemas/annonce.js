const { model, Schema } = require('mongoose');
 
const annonceSchema = new Schema({
    Guild: String,
    Channel: String,
})
 
module.exports = model('annonce', annonceSchema);