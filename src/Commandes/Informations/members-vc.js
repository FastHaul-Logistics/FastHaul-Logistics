const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const voiceschema = require('../../Schemas/voicechannels.js');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('members-vc')
    .setDescription('Configure your members voice channel.')
    .addSubcommand(command => command.setName('set').setDescription('Sets your total members voice channel.').addChannelOption(option => option.setName('voice-channel').setDescription('Specified voice channel wll be your total members voice channel.').setRequired(true).addChannelTypes(ChannelType.GuildVoice)))
    .addSubcommand(command => command.setName('remove').setDescription('Removes your total members VC.')),
    async execute(interaction, err) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels) && interaction.user.id !== '619944734776885276') return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});
        const sub = interaction.options.getSubcommand();
 
        switch (sub) {
            case 'total-set':
 
            const voicedata = await voiceschema.findOne({ Guild: interaction.guild.id });
            const voicechannel = interaction.options.getChannel('voice-channel');
            const voicetotalchannel = await interaction.guild.channels.cache.get(voicechannel.id);
 
            if (!voicedata) {
 
                await voiceschema.create({
                    Guild: interaction.guild.id,
                    TotalChannel: voicechannel.id
                })
 
                voicetotalchannel.setName(`• Total Members: ${interaction.guild.memberCount}`).catch(err);
 
                const voiceembed = new EmbedBuilder()
                .setColor('#af00fe')
                .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081275127850864640/largeblue.png')
                .setAuthor({ name: `🔊 Member Voice Tool`})
                .setTimestamp()
                .setTitle('> Total Members channel has \n> been set up')
                .addFields({ name: `• Channel was Set Up`, value: `> Your channel (${voicechannel}) has been set \n> up to be your total members \n> voice channel! It will now display your \n> total members accordingly.`})
                .setFooter({ text: `🔊 Total Channel Set`})
 
                await interaction.reply({ embeds: [voiceembed]})
 
            } else {
                await interaction.reply({ content: `You have **already** set up a **total members** VC in this server!`, ephemeral: true})
            }
 
            break;
            case 'total-remove':
 
            const totalremovedata = await voiceschema.findOne({ Guild: interaction.guild.id });
 
            if (!totalremovedata) return await interaction.reply({ content: `You **have not** set up a **total members** VC yet, cannot delete **nothing**..`, ephemeral: true});
            else {
 
                const removechannel = await interaction.guild.channels.cache.get(totalremovedata.TotalChannel);
 
                if (!removechannel) {
 
                    await voiceschema.deleteMany({ Guild: interaction.guild.id });
                    await interaction.reply({ content: `Your **total member** VC seems to be corrupt or non existant, we **disabled** it regardless!`, ephemeral: true});
 
                } else {
 
                    await removechannel.delete().catch(err => {
                        voiceschema.deleteMany({ Guild: interaction.guild.id });
                        return interaction.reply({ content: `**Couldn't** delete your VC, but we **still** disabled your **total members** VC!`, ephemeral: true})
                    });
 
                    await voiceschema.deleteMany({ Guild: interaction.guild.id });
                    await interaction.reply({ content: `Your **total members** VC has been **successfuly** disabled!`, ephemeral: true});
                }
 
            }
        }
 
    }
 
}