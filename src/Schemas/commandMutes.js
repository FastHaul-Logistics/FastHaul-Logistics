const {model, Schema} = require('mongoose');

let commandMutes = new Schema({
    Guild: String
});

module.exports = model("commandMutes", commandMutes);