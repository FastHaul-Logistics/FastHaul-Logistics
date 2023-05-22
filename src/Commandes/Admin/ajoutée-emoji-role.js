const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ajoutée-emoji-role')
    .setDescription('Ajoute un emoji à un rôle spécifique.')
    .addRoleOption(option =>
      option.setName('rôle')
        .setDescription('Le rôle pour ajouter l’emoji à.')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('emoji')
        .setDescription('L’emoji à ajouter au rôle.')
        .setRequired(true)
    ),
  async execute(interaction) {
    const { guild, user, options } = interaction;
    const role = options.getRole('rôle');
    const emoji = options.getString('emoji');
    
    // Check if user has permission to manage roles
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return await interaction.reply({ content: `Vous **n’avez** pas la permission de le faire!`, ephemeral: true});
    
    // Add emoji to role
    try {
      await role.edit({ hoist: true }); // make role hoisted to show emoji
      await role.setName(`${role.name} ${emoji}`); // add emoji to the role name
    } catch (error) {
      console.error(error);
      return interaction.reply(`Erreur d’ajout d’emoji '${emoji}' au rôle '${role.name}'.`);
    }
    
    // Send DM to user
    try {
      await user.send(`Votre ajout de rôle emoji a été effectué pour le rôle '${role.name}' avec emoji '${emoji}'.`);
    } catch (error) {
      console.error(error);
      return interaction.reply(`Error sending DM to user '${user.username}'.`);
    }
    
    // Reply to interaction
    return interaction.reply(`Emoji '${emoji}' ajouté au poste '${role.name}'.`);
  },
};