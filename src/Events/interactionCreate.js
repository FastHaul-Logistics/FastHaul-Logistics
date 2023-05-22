const { Interaction } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isStringSelectMenu()) {
            if (interaction.customId == 'set-status') {
              let status = interaction.values[0];
              client.user.setStatus(status);
          
              await interaction.editReply({
                content: `Status updated to _"${status}"_`,
                components: [],
              });
            }
          }
          if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return
        
          const blacklist = require('../Schemas/blacklist.js')
          const data = await blacklist.findOne({User: interaction.user.id})

          if (data) return await interaction.reply({ content: `Vous avez été **mis sur liste noire** de l’utilisation de ce bot! Cela permet au développeur de ne pas utiliser ses commandes pour une raison donnée`, ephemeral: true})

        try{


            await command.execute(interaction, client);
        } catch (error) {
            console.log(error);
            await interaction.reply({
                content: 'Il y a eu une erreur lors de l’exécution de cette commande!', 
                ephemeral: true
            });
        }
      },
};