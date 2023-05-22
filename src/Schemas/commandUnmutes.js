const {model, Schema} = require('mongoose');

let commandUnmutes = new Schema({
    Guild: String
});

module.exports = model("commandUnmutes", commandUnmutes);