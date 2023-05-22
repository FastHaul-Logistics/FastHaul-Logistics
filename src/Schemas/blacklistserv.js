const { model, Schema } = require('mongoose')

let blacklistserver = new Schema({
    Guild: String
})

module.exports = model('blacklistserver', blacklistserver)