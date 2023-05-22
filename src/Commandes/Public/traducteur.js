const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const translate = require('@iamtraction/google-translate')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('traduction')
    .setDescription("Traduit un texte d'une autre langue")
    .addStringOption(option => option.setName('message').setDescription('Que voulez-vous traduire ?').setRequired(true))
    .addStringOption(option => option.setName('langue').setDescription('La langue dans laquelle vous souhaitez traduire').addChoices(
        {name: 'English', value: 'en'},
        {name: 'Latin', value: 'la'},
        {name: 'French', value: 'fr'},
        {name: 'German', value: 'de'},
        {name: 'Italian', value: 'it'},
        {name: 'Portugese', value: 'pt'},
        {name: 'Spanish', value: 'es'},
        {name: 'Greek', value: 'gl'},
        {name: 'Russion', value: 'ru'},
        {name: 'Japanese', value: 'ja'},
        {name: 'Arabic', value: 'ar'},
    ).setRequired(true)),
    async execute (interaction) {
        const { options } = interaction;
        const text = options.getString('mesage');
        const lan = options.getString('langue');

        await interaction.reply({ content: '🛠Traduction du texte'})

        const applied = await translate(text, {to : `${lan}`});

        const embed = new EmbedBuilder()
        .setColor('#af00fe')
        .setTitle("Traduction faite avec succès")
        .addFields({ name: 'Ancien texte', value: `\`\`\`${text}\`\`\``, inline: false})
        .addFields({ name: 'Texte traduit:', value: `\`\`\`${applied.text}\`\`\``, inline: false})

        await interaction.editReply({ content: '', embeds: [embed], ephemeral: true })
    }
}