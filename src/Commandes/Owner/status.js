const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('status-bot')
    .setDescription('Définis le status du bot')
    .addStringOption(option => option.setName('status').setDescription('Définis le type de status du bot').setMaxLength(128).setRequired(true))
    .addStringOption(option => option.setName('type').setDescription('The type of status you want the bot to have').addChoices( { name: 'Watching', value: `${4}`},{ name: 'Playing', value: `${1}`},{ name: 'Listening', value: `${3}`},{ name: 'Competing', value: `${6}`},{ name: 'Streaming', value: `${2}`})),
    async execute(interaction, client) {

        const {options} = interaction;
        const status = options.getString('status');
        const type = options.getString('type');

        if (interaction.user.id != '1082828793447718952') return await interaction.reply({ content: "Tu n'est pas le créateur du bot tu n'est donc pas autorisée a utilisée cette commande !!", ephemeral: true});
        else {

            client.user.setActivity({
                name: status,
                type: type-1,
                url: `https://www.twitch.tv/frenchcreator28`
            })

            const embed = new EmbedBuilder()
            .setColor('#c5ae00')
            .setDescription(`✔ The bot now has the status \`${status}\`, with the type ${type-1}`)

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}