const { Client, SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js')
const ms = require('ms')
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName("effacer-message")
    .setDescription("Supprimer des messages en masse.")
    .addNumberOption(
        option =>
        option.setName("nombre")
        .setDescription("Choisis le nombre de messages que je dois supprimer.")
        .setRequired(true)
        .setMaxValue(100))
    .addChannelOption(
        option =>
        option.setName("salon")
        .setDescription("Choisis le salon où je dois supprimer les messages.")
        .setRequired(false)
        .addChannelTypes(ChannelType.GuildText))
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, channel } = interaction;
 
        const Response = new EmbedBuilder()
        .setTimestamp(Date.now())
        .setTitle("Messages")
 
        const target_channel = options.getChannel("channel");
        const amount = options.getNumber("amount");
 
        if(target_channel) {
            await target_channel.bulkDelete(amount, true).then(async messages => {
                Response.setDescription(`✅ ${messages.size} messages ont été supprimés.`)
                await interaction.reply({embeds: [Response]}).then(inter => {
                    setTimeout(() => inter.interaction.deleteReply(), 10*1000);
                })
            })
        } else {
            await channel.bulkDelete(amount, true).then(async messages => {
                Response.setDescription(`✅ ${messages.size} messages ont été supprimés.`)
                await interaction.reply({embeds: [Response]}).then(inter => {
                    setTimeout(() => inter.interaction.deleteReply(), 10*1000);
                })
            })
        }
    }
}