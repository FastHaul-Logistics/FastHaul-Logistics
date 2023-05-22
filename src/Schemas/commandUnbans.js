const {model, Schema} = require('mongoose');

let commandUnbans = new Schema({
    Guild: String
});

module.exports = model("commandUnbans", commandUnbans);