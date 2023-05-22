const mongoose = require('mongoose')
const mongodbURL = process.env.MONGODBURL;
const client = require('../index');
const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('Ready!');

        if (!mongodbURL) return;

        await mongoose.connect(mongodbURL || 'mongodb+srv://multipurpose:mzacVfmADTmxml7Z@cluster0.y4k1m.mongodb.net/test', {
            keepAlive: true,
            userNewUrlParser: true,
            userUnifiedTopology: true
        })

        if (mongoose.connect) {
            console.log(`La database est en route ✔`)
        }

        client.user.setActivity({
            name: "mit Jxn",
            type: ActivityType.Playing,
            url: ""
         })
        },
    };