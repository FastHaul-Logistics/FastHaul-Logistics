const ticketSchema = require('../../Schemas/ticketSchema');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-stop')
        .setDescription('Désactive le système de ticket pour le serveur.'),
 
    async execute(interaction, client) {
        try {
            const GuildID = interaction.guild.id;
 
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return await interaction.reply({ content: 'Vous **n’avez** pas la permission de le faire!', ephemeral: true});
            }
 
            const embed2 = new EmbedBuilder()
            .setColor('DarkRed')
            .setDescription(`> Le système de ticket a déjà été désactivé!`)
            .setTimestamp()
            .setAuthor({ name: `🎫 système de ticket`})
            .setFooter({ text: `🎫 Système de ticket désactivé`})
            .setThumbnail("https://imgur.com/DQAfUSF.png")
            const data = await ticketSchema.findOne({ GuildID: GuildID });
            if (!data)
            return await interaction.reply({ embeds: [embed2], ephemeral: true });
 
            await ticketSchema.findOneAndDelete({ GuildID: GuildID });
 
            const channel = client.channels.cache.get(data.Channel);
            if (channel) {
                await channel.messages.fetch({ limit: 1 }).then(messages => {
                    const lastMessage = messages.first();
                    if (lastMessage.author.id === client.user.id) {
                        lastMessage.delete();
                    }
                });
            }
 
            const embed = new EmbedBuilder()
            .setColor('DarkRed')
            .setDescription(`> Le système de ticket a été désactivé!`)
            .setTimestamp()
            .setAuthor({ name: `🎫 système de ticket`})
            .setFooter({ text: `🎫 Système de ticket désactivé`})
            .setThumbnail("https://imgur.com/DQAfUSF.png")
 
            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
        }
    }
};