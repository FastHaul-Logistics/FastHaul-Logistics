const { model, Schema } = require('mongoose');
 
const ticketSchema2 = new Schema({
    GuildID: String,
    Category: String,
    Channel: String,
    Role: String,
    Logs: String,
 
})
 
module.exports = model('tickets2', ticketSchema2);