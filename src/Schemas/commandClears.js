const {model, Schema} = require('mongoose');

let commandClears = new Schema({
    Guild: String
});

module.exports = model("commandClears", commandClears);