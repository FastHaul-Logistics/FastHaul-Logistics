const { SlashCommandBuilder } = require('@discordjs/builders')
const testSchema = require('../../Schemas/test')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('testdabatase')
    .setDescription('DB Test'),
    async execute (interaction) {
        const userId = interaction.user.id;

        const botDeveloperId = '1082828793447718952';
        if (userId !== botDeveloperId) {
          return await interaction.reply("Tu n'est pas le créateur du bot tu n'est donc pas autorisée a utilisée cette commande !!");
        }
        testSchema.findOne({ GuildID: interaction.guild.id, UserID: interaction.user.id}, async (err, data) => {
            if (err) throw err;

            if (!data) {
                testSchema.create({
                    GuildID: interaction.guild.id,
                    UserID: interaction.user.id
                })
            }

            if (data) {
                console.log(data)
            }
        })
    }
}