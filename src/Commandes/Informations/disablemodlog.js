const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const Modlog = require('../../Schemas/modlog');
 
module.exports = {
    config: {
        name: "logs-stop",
        category: "Moderator",
        description: `disables modlog`,
        usage: "disablemodlog",
        type: "slash", // or "slash"
        cooldown: 5
    },
    data: new SlashCommandBuilder()
        .setName('désactiver-logs')
        .setDescription('Désactive le canal de log mod pour ce serveur.'),
        async execute(interaction) {
            const guildId = interaction.guild.id;
 
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return interaction.reply({ content: 'Vous n’avez pas la permission d’utiliser cette commande.', ephemeral: true });
            }
 
            try {
                const modlog = await Modlog.findOne({ guildId });
                if (!modlog) {
                    return interaction.reply({ content: 'Le canal de log mod n’a pas encore été configuré.', ephemeral: true });
                }
 
                await Modlog.findOneAndDelete({ guildId });
 
                return interaction.reply(`Canal de log mod désactivé.`);
            } catch (error) {
                console.error(error);
                return interaction.reply('Une erreur s’est produite lors de la désactivation du canal de log mod');
            }
        },
};