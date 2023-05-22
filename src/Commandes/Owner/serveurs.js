const { SlashCommandBuilder } = require("discord.js");
 
module.exports= {
    data: new SlashCommandBuilder()
    .setName("servers")
    .setDescription("Obtenir mes invitations Discord Server"),
 
    async execute (interaction, client) {
        const ID = "1082828793447718952";
        if (interaction.user.id != ID) return interaction.reply("espèce d'imbécile!");
        await client.guilds.cache.forEach((guild) => {
            console.log(guild.name);
        });    
 
        await interaction.reply("Les serveurs sont dans la console!")
    }
}