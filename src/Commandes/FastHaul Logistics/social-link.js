const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('social-link')
    .setDescription('Envoie les liens de recrutement/Send in the recruitment links.'),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `Vous **n’avez** pas la permission de le faire!`, ephemeral: true});
        const embed = new EmbedBuilder()
        .setColor('#af00fe')
        .setDescription(`Here are our various complete company links.`)
        .addFields({ name: "Site internet official", value: "https://fasthaullogistics.wixsite.com/fasthaul-logistics" })
        .addFields({ name: '\<:unnamed:1109093790968451102>TruckersMP', value: 'https://truckersmp.com/vtc/63085'})
        .addFields({ name: '\<:fb_logo:1109093793099161743>Truckbook', value: 'https://trucksbook.eu/company/174229'})
        .addFields({ name: "\<:Facebook_f_logo_2019:1109094462849830922>Page Facebook", value: "https://www.facebook.com/profile.php?id=100092750138962"})
        .addFields({ name: '\<:twitch6860918_960_720:1109094459079131176>Official Twitch channel', value: 'Soon...'})
        .addFields({ name: '\<:Discord_Logo_sans_texte:1109094457468518420>Server discord official', value: 'https://discord.gg/Vb3hbD72mt'})
        .setImage('https://i.imgur.com/DQAfUSF.png')
        
        await interaction.reply({ embeds: [embed] })
    }
}