const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot-info')
        .setDescription('En savoir un peu plus sur le bot & serveur')
        .setDMPermission(false),
    async execute(interaction) {

        //Ping
        const startTime = Date.now();
        const reply = await interaction.reply('Calcul dping du bot...');
        const endTime = Date.now();
        const ping = endTime - startTime;

         // Uptime
        const uptime = process.uptime();
        const uptimeString = formatUptime(uptime);

        const { guild } = interaction; // Member Count
        const commandCount = interaction.client.commands.size; // Command Count
        const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // Memory Usage
        const cpuUsage = process.cpuUsage().user / 1000000; // CPU Usage
        const botVersion = '1.0.0';  // BOT Version
        const roleCount = guild.roles.cache.size; // Roles Count

        const embed = new EmbedBuilder()
            .setTitle('BOT Information')
            .setColor('Blue')
            .addFields(
                { name: 'Uptime', value: `> ${uptimeString}`, inline: true },
                { name: 'BOTS Ping', value: `> ${ping}ms`, inline: true },
                { name: 'BOTS Creation', value: `> <t:1667563200>`, inline: true },
                { name: 'Member Count', value: `> ${guild.memberCount}`, inline: true },
                { name: 'Command Count', value: `> ${commandCount}`, inline: true },
                { name: 'Memory Usage', value: `> ${memoryUsage.toFixed(2)} MB`, inline: true },
                { name: 'CPU Usage', value: `> ${cpuUsage.toFixed(2)}%`, inline: true },
                { name: 'BOTS Version', value: `> ${botVersion}`, inline: true },
                { name: 'Roles Count', value: `> ${roleCount}`, inline: true }
            )

        await reply.edit({ content: '', embeds: [embed] });
    }
}

// Uptime Abbreviation
function formatUptime(uptime) {
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const days = Math.floor(uptime / (60 * 60 * 24));

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}