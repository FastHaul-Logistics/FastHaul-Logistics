const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const Modlog = require('../../Schemas/modlog');
 
module.exports = {
    config: {
        name: "logs-config",
        category: "Moderator",
        description: `sets up modlog`,
        usage: "modlog channel",
        type: "slash", // or "slash"
        cooldown: 5
    },
    data: new SlashCommandBuilder()
        .setName('définir-logs')
        .setDescription('Configurer le canal de log mod pour ce serveur.')
        .addChannelOption(option => option.setName('salon').setDescription('Le canal à définir comme canal de log mod').setRequired(true)),
        async execute(interaction) {
          const guildId = interaction.guild.id;
          const logChannelId = interaction.options.getChannel('salon').id;
 
          if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
              return interaction.reply({ content: 'Vous n’avez pas la permission d’utiliser cette commande.', ephemeral: true });
          }
 
          try {
              let modlog = await Modlog.findOne({ guildId });
              if (modlog) {
                  return interaction.reply({ content: 'Un canal de log mod a déjà été configuré pour ce serveur.', ephemeral: true });
              }
 
              modlog = await Modlog.findOneAndUpdate(
                  { guildId },
                  { logChannelId },
                  { upsert: true }
              );
 
              return interaction.reply(`Canal de log mod défini sur <#${logChannelId}>`);
          } catch (error) {
              console.error(error);
              return interaction.reply('Une erreur s’est produite lors de la configuration du canal de log mod');
          }
      }
 };