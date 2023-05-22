const {model, Schema} = require('mongoose');

let commandBans = new Schema({
    Guild: String
});

module.exports = model("commandBans", commandBans);