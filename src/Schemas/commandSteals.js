const {model, Schema} = require('mongoose');

let commandSteals = new Schema({
    Guild: String
});

module.exports = model("commandSteals", commandSteals);