const { model, Schema } = require('mongoose');
 
const ticketSchema = new Schema({
    GuildID: String,
    MemberID: String,
    Category: String,
    TicketAccess: String,
    TicketLogs: String,
});
 
module.exports = model('ticket2', ticketSchema);