const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('say')
    .setDMPermission(false)
    .addStringOption(option => option.setName('message').setDescription('Le message fourni sera envoyé via le bot').setRequired(true).setMaxLength(2000))
    .setDescription('Dire quelque chose via le bot.'), 
    async execute(interaction, client) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) && interaction.user.id !== '619944734776885276') return await interaction.reply({ content: 'Vous **n’avez** pas la permission de le faire!', ephemeral: true});

        const message = interaction.options.getString('message')

        await interaction.channel.send({ content: `${message}` })
        await interaction.reply({ content: `Le message "${message}" a été **envoyé** comme moi!`, ephemeral: true})
    }
}