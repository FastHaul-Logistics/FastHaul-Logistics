const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats-bot')
        .setDescription('Statistiques du gestionnaire de serveur'),
    async execute(interaction, client) {
 
            if(interaction.member.id !== '1082828793447718952') return interaction.reply({ content: "Tu n'est pas le créateur du bot tu n'est donc pas autorisée a utilisée cette commande !!", ephemeral: true})
 
                const totalMembers = await interaction.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
 
                const embed = new EmbedBuilder()
                  .setColor("Purple")
                  .setThumbnail()
                  .setDescription(`⚒️ Statistics of **${client.user.username}**` )
                  .addFields({ name: "** **", value: `** **`, inline: false})
                  .addFields({ name: "🤖 Commands:", value: `${client.commands.size}`, inline: true})
                  .addFields({ name: "👨‍👩‍👧‍👦 Users:", value: `${totalMembers}`, inline: true})
                  .addFields({ name: "🌎 Servers:", value: `${client.guilds.cache.size}`, inline: true})
                  .addFields({ name: "💬 Channels:", value: `${client.channels.cache.size}`, inline: true})
                  .addFields({ name: "📅 Created:", value: `<t:${parseInt(client.user.createdTimestamp / 1000,10)}:R>`, inline: true})
                  .addFields({ name: "🏓 Ping", value: `${client.ws.ping}ms`, inline: true})
                  .addFields({ name: "⏰ Up Time", value: `<t:${parseInt(client.readyTimestamp / 1000,10)}:R>`, inline: true})
                  .addFields({ name: "💳 ID ", value: `${client.user.id}`, inline: true})
                  .addFields({ name: "💾 CPU Usage", value: `${(process.memoryUsage().heapUsed /1024 /1024).toFixed(2)}%`, inline: true})
                  .setFooter({ text: `${client.user.username} 2023 - 2023` })
 
    await interaction.reply({ embeds: [embed], ephemeral: true });
            
    },
};