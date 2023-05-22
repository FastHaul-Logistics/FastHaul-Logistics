const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription(`Découvrez le temps de disponibilité des bots`),
        async execute(interaction) {
            const userId = interaction.user.id;

            const botDeveloperId = '1082828793447718952';
            if (userId !== botDeveloperId) {
              return await interaction.reply("Tu n'est pas le créateur du bot tu n'est donc pas autorisée a utilisée cette commande !!");
            }
            const uptime = process.uptime();
            const uptimeString = formatUptime(uptime);
 
            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Uptime')
                .setDescription(`> ${uptimeString}`)
 
            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        },
    };
 
    function formatUptime(uptime) {
        const seconds = Math.floor(uptime % 60);
        const minutes = Math.floor((uptime / 60) % 60);
        const hours = Math.floor((uptime / (60 * 60)) % 24);
        const days = Math.floor(uptime / (60 * 60 * 24));
 
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }