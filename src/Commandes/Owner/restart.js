const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('restart')
    .setDMPermission(false)
    .setDescription("Permet de faire redémarrer le bot."),
    async execute(interaction, client) {
        const userId = interaction.user.id;

        const botDeveloperId = '1082828793447718952';
        if (userId !== botDeveloperId) {
          return await interaction.reply("Tu n'est pas le créateur du bot tu n'est donc pas autorisée a utilisée cette commande !!");
        }
        if (interaction.user.id === `1082011193247539240`) {
            await interaction.reply({ content: `**Shutting down..**`, ephemeral: true})
            await client.user.setStatus("invisible")
            process.exit();
        } else {
            return interaction.reply({ content: `Only **the owner** of PixelVal can use this command.`, ephemeral: true})
        }
    }
}