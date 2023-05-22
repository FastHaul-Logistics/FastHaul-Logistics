const { model, Schema } = require('mongoose');

let pingstaff = new Schema({
    Guild: String,
    RoleID: String,
    RoleName: String
})

module.exports = model('pingstaff', pingstaff)