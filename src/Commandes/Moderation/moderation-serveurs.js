const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require(`discord.js`);
const banCommand = require('../../Schemas/commandBans.js');
const muteCommand = require('../../Schemas/commandMutes.js');
const stealCommand = require('../../Schemas/commandSteals.js');
const clearCommand = require('../../Schemas/commandClears.js');
const unbanCommand = require('../../Schemas/commandUnbans.js');
const unmuteCommand = require('../../Schemas/commandUnmutes.js');

module.exports = {
    category: "Managing",
    data: new SlashCommandBuilder()
    .setName('moderation-serveur')
    .setDescription('Active ou désactive la modération de ton serveur')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(option => option.setName('ban-command').setDescription('Voulez-vous activer la commande ban ?').addChoices(
        { name: 'enable', value: 'enable' },
        { name: 'disable', value: 'disable' }
      ).setRequired(true))
      .addStringOption(option => option.setName('mute-command').setDescription('Voulez-vous activer la commande mute ?').addChoices(
        { name: 'enable', value: 'enable' },
        { name: 'disable', value: 'disable' }
      ).setRequired(true))
      .addStringOption(option => option.setName('steal-command').setDescription('Voulez-vous activer la commande steal ?').addChoices(
        { name: 'enable', value: 'enable' },
        { name: 'disable', value: 'disable' }
      ).setRequired(true))
      .addStringOption(option => option.setName('clear-command').setDescription('Voulez-vous activer la commande clear ?').addChoices(
        { name: 'enable', value: 'enable' },
        { name: 'disable', value: 'disable' }
      ).setRequired(true))
      .addStringOption(option => option.setName('unban-command').setDescription('Voulez-vous activer la commande unban ?').addChoices(
        { name: 'enable', value: 'enable' },
        { name: 'disable', value: 'disable' }
      ).setRequired(true))
      .addStringOption(option => option.setName('unmute-command').setDescription('Voulez-vous activer la commande unmute ?').addChoices(
        { name: 'enable', value: 'enable' },
        { name: 'disable', value: 'disable' }
      ).setRequired(true)),
    async execute(interaction, client) {

        if (!interaction.guild) return await interaction.reply({ content: "This command is only usable in the server!", ephemeral: true });

        const { options } = interaction;

        const ban = options.getString('ban-command');
        const mute = options.getString('mute-command');
        const steal = options.getString('steal-command');
        const clear = options.getString('clear-command');
        const unban = options.getString('unban-command');
        const unmute = options.getString('unmute-command');

        if (ban === 'enable') {
            await banCommand.findOneAndUpdate({ Guild: interaction.guild.id }, { Guild: interaction.guild.id }, { upsert: true });
        } else {
            await banCommand.findOneAndDelete({ Guild: interaction.guild.id });
        }

        if (mute === 'enable') {
            await muteCommand.findOneAndUpdate({ Guild: interaction.guild.id }, { Guild: interaction.guild.id }, { upsert: true });
        } else {
            await muteCommand.findOneAndDelete({ Guild: interaction.guild.id });
        }

        if (steal === 'enable') {
            await stealCommand.findOneAndUpdate({ Guild: interaction.guild.id }, { Guild: interaction.guild.id }, { upsert: true });
        } else {
            await stealCommand.findOneAndDelete({ Guild: interaction.guild.id });
        }

        if (clear === 'enable') {
            await clearCommand.findOneAndUpdate({ Guild: interaction.guild.id }, { Guild: interaction.guild.id }, { upsert: true });
        } else {
            await clearCommand.findOneAndDelete({ Guild: interaction.guild.id });
        }
        
        if (unban === 'enable') {
            await unbanCommand.findOneAndUpdate({ Guild: interaction.guild.id }, { Guild: interaction.guild.id }, { upsert: true });
        } else {
            await unbanCommand.findOneAndDelete({ Guild: interaction.guild.id });
        }

        if (unmute === 'enable') {
            await unmuteCommand.findOneAndUpdate({ Guild: interaction.guild.id }, { Guild: interaction.guild.id }, { upsert: true });
        } else {
            await unmuteCommand.findOneAndDelete({ Guild: interaction.guild.id });
        }

        const updatedBanData = await banCommand.findOne({ Guild: interaction.guild.id });
        const updatedMuteData = await muteCommand.findOne({ Guild: interaction.guild.id });
        const updatedStealData = await stealCommand.findOne({ Guild: interaction.guild.id });
        const updatedClearData = await clearCommand.findOne({ Guild: interaction.guild.id });
        const updatedUnbanData = await unbanCommand.findOne({ Guild: interaction.guild.id });
        const updatedUnmuteData = await unmuteCommand.findOne({ Guild: interaction.guild.id });

        const checkEmbed = new EmbedBuilder()
        .setColor('#af00fe')
        .setTitle(`Moderation Commands Status`)
        .addFields(
            { name: "Ban Command", value: updatedBanData ? `:white_check_mark: On` : `:x: Off`, inline: true },
            { name: "Mute Command", value: updatedMuteData ? `:white_check_mark: On` : `:x: Off`, inline: true },
            { name: "Steal Command", value: updatedStealData ? `:white_check_mark: On` : `:x: Off`, inline: true },
            { name: '\u200B\n', value: '\u200B\n', inline: false },
            { name: "Clear Command", value: updatedClearData ? `:white_check_mark: On` : `:x: Off`, inline: true },
            { name: "Unban Command", value: updatedUnbanData ? `:white_check_mark: On` : `:x: Off`, inline: true },
            { name: "Unmute Command", value: updatedUnmuteData ? `:white_check_mark: On` : `:x: Off`, inline: true }
        );

        await interaction.reply({ embeds: [checkEmbed] });


    }
}