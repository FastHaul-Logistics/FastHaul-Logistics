const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require(`discord.js`);
const banCommand = require('../../Schemas/commandBan.js');
const muteCommand = require('../../Schemas/commandMute.js');
const stealCommand = require('../../Schemas/commandSteal.js');
const clearCommand = require('../../Schemas/commandClear.js');
const unbanCommand = require('../../Schemas/commandUnban.js');
const unmuteCommand = require('../../Schemas/commandUnmute.js');

module.exports = {
    category: "Managing",
    data: new SlashCommandBuilder()
        .setName('liste-moderation')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription('Vérifier l’état actuel des commandes de modération.'),
    async execute(interaction, client) {

        if (!interaction.guild) return await interaction.reply({ content: "Cette commande n’est utilisable que sur le serveur!", ephemeral: true });

        const banData = await banCommand.findOne({ Guild: interaction.guild.id });
        const muteData = await muteCommand.findOne({ Guild: interaction.guild.id });
        const stealData = await stealCommand.findOne({ Guild: interaction.guild.id });
        const clearData = await clearCommand.findOne({ Guild: interaction.guild.id });
        const unbanData = await unbanCommand.findOne({ Guild: interaction.guild.id });
        const unmuteData = await unmuteCommand.findOne({ Guild: interaction.guild.id });

        const checkEmbed = new EmbedBuilder()
        .setColor('Green')
        .setTitle(`Moderation Commands Status`)
        .addFields(
            { name: "Ban Command", value: banData ? `:white_check_mark: On` : `:x: Off`, inline: true },
            { name: "Mute Command", value: muteData ? `:white_check_mark: On` : `:x: Off`, inline: true },
            { name: "Steal Command", value: stealData ? `:white_check_mark: On` : `:x: Off`, inline: true },
            { name: '\u200B\n', value: '\u200B\n', inline: false },
            { name: "Clear Command", value: clearData ? `:white_check_mark: On` : `:x: Off`, inline: true },
            { name: "Unban Command", value: unbanData ? `:white_check_mark: On` : `:x: Off`, inline: true },
            { name: "Unmute Command", value: unmuteData ? `:white_check_mark: On` : `:x: Off`, inline: true }
        );
    
        await interaction.reply({ embeds: [checkEmbed], ephemeral: true});

    }
}