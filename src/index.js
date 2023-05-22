const { Client, GatewayIntentBits, ActivityType, EmbedBuilder, TextInputBuilder, isStringSelectMenu, ComponentType, TextInputStyle, PermissionFlagsBits, PermissionsBitsField, Permissions, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, Collection, Embed, ChannelType, StringSelectMenuBuilder, Partials, GuildMember, ModalBuilder, MessageManager, Message } = require('discord.js')
const fs = require('fs')
const mongoose = require('mongoose')
const client = new Client({ 
intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping],
partials: [Partials.Channel, Partials.Reaction, Partials.Message] })

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/Events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/Commandes");
const modschema = require('./Schemas/modmailSchema.js');
const moduses = require('./Schemas/modmailUses.js');
const welcomeschema = require('./Schemas/welcome.js')
const roleschema = require('./Schemas/autorole.js')
const AuditLogEvent = require('./Schemas/modlog.js')
const joinSchema = require('./Schemas/jointocreate.js')
const joinChannelSchema = require('./Schemas/jointocreatechannel.js');
const leaveChannelSchema = require('./Schemas/jointocreatechannel.js');
const Modlog = require('./Schemas/modlog.js');
const Discord = require('discord.js');
const { version: djsversion } = require('discord.js');
const restart = new Date().toLocaleString();
const { WebhookClient } = require('discord.js');
const webhookClient = new WebhookClient({ id: 'id webhooks', token: 'token webhooks' });
const StaffMessages = require('./Schemas/staffMessages');
const StaffSchema = require('./Schemas/staffSchema');
const ticketSchema = require("./Schemas/ticketSchema");
const { createTranscript } = require('discord-html-transcripts');
const publishschema = require('./Schemas/autopublish.js');
const { CaptchaGenerator } = require('captcha-canvas');
const capschema = require('./Schemas/verify.js');
const verifyusers = require('./Schemas/verifyusers.js');
const banschema = require(`./Schemas/bans.js`)
const memberJoin = require('./Schemas/memberJoin.js');
const blacklistserver = require('./Schemas/blacklistserv.js');
const reactschema = require('./Schemas/reactionroles.js');
const ms = require('ms');
const blacklist = require('./Schemas/blacklist.js');
const cooldowns = new Map();

client.commands = new Collection();

require('dotenv').config();

const process = require('node:process');

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

client
  .login('TOKEN')
  .then(() => {
    console.log('[Discord API] '.green + client.user.username + ' est en route ✔.'.green);
    console.log('[MongoDB API] '.green + 'is now connected.')
    console.log(`Logged in as ${client.user.username}!`);
    })
  .catch((err) => console.log(err));
mongoose.connect('TOKEN MONGODB', () => {
  console.log("Mongo connected");
});

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/Events");
    client.handleCommands(commandFolders, "./src/Commandes");
    client.login('TOKEN')
})();



client.on('guildCreate', async guild => {
    try {
      const owner = await guild.fetchOwner();
      const embed = new EmbedBuilder()
        .setColor("#af00fe")
        .setTitle("Salutation👋")
        .setDescription(`Salut, je m'appelle <@1106144039109132329>.
        Je suis un bot polyvalent français et je pense pouvoir améliorer ton serveur !
        
        Je possède de nombreuses commandes, toutes visibles avec la commande **/aide**
        
        **Pour répondre au mieux à tes besoins, tu peux me configurer facilement avec la commande __/logs-setup__**`)
        .setThumbnail();
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('Support Server')
            .setURL('https://discord.gg/gqTE8m2f9n')
        );
      owner.send({ embeds: [embed], components: [row] });
    } catch (error) {
      console.error(`Impossible d’envoyer un message au propriétaire du serveur pour guild ${guild.name}.`, error);
    }
})

client.on(Events.MessageCreate, async (message) => {
  if (message.content === `<@${client.user.id}>`) {
    if (message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#af00fe')
            .setTitle(`${client.user.username} Help`)
            .setDescription(`
          • Voici mon prefix par default: \`/\`
          • Ma commande principal: \`/aide\`
          • Serveur dont je suis présent: \`${client.guilds.cache.size}\` serveurs
          `)
            .setImage('https://imgur.com/DQAfUSF.png')
            .setTimestamp()
        ]
      })
    } else {
      return;
    }
  }
})

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {

  try {
    if (newState.member.guild === null) return;
  } catch (err) {
    return;
  }

  const joinData = await joinSchema.findOne({ Guild: newState.guild.id });
  const joinChannelData = await joinChannelSchema.findOne({ Guild: newState.member.guild.id, User: newState.member.id });

  const voiceChannel = newState.channel;

  if (!joinData) return;

  if (!voiceChannel) return;
  else {

    if (voiceChannel.id === joinData.Channel) {
      if (joinChannelData) {

      } else {
        try {
          const channel = await newState.member.guild.channels.create({
            type: ChannelType.GuildVoice,
            name: `Vocal-de-${newState.member.user.username}`,
            userLimit: joinData.voiceLimit,
            parent: joinData.Category
          })
  
          try {
            await newState.member.voice.setChannel(channel.id);
          } catch (err) {
            return;
          }
  
          setTimeout(() => {
            joinChannelSchema.create({
              Guild: newState.member.guild.id,
              Channel: channel.id,
              User: newState.member.id
            }, 500)
          })
        } catch (err) {
          try {
            await newState.member.send({ content: `Je n’ai pas pu créer votre chaîne, il me manque des autorisations`});
          } catch (err) {
            return;
          }
          return;
        } try {
          
          const embed = new EmbedBuilder()
          .setColor('#af00fe')
          .setTimestamp()
          .setAuthor({ name: '🔊oin to create system'})
          .setFooter({ text: '🔊Channel créée'})
          .setTitle('> Channel créée')
          .addFields({ name: 'Channel créée', value: `> Votre canal vocal a été \n> ID créé ${newState.member.guild.name}`})
  
          await newState.member.send({ embeds: [embed] });
        } catch (err) {
          return;
        }
      }
    }
  }
})

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  try {
    if (oldState.member.guild === null) return;
  } catch (err) {
    return;
  }

  const leaveChannelData = await leaveChannelSchema.findOne({ Guild: oldState.member.guild.id, User: oldState.member.id });
  if (!leaveChannelData) return;
  else {
    const voiceChannel = await oldState.member.guild.channels.cache.get(leaveChannelData.Channel);

    try {
      await voiceChannel.delete();
    } catch (err) {
      return;
    }

    await joinChannelSchema.deleteMany({ Guild: oldState.guild.id, User: oldState.member.id});
    try {

      const embed = new EmbedBuilder()
          .setColor('#af00fe')
          .setTimestamp()
          .setAuthor({ name: '🔊oin to create system'})
          .setFooter({ text: '🔊Channel supprimer'})
          .setTitle('> Channel supprimer')
          .addFields({ name: 'Channel supprimer', value: `> Votre canal vocal a été \n> supprimé ${newState.member.guild.name}`})

          await newState.member.send({ embeds: [embed] })
    } catch (err) {
      return 
    }
  }
})



client.on(Events.MessageCreate, async message => {
 
    if (message.guild) return;
    if (message.author.id === client.user.id) return;
 
    const usesdata = await moduses.findOne({ User: message.author.id });
 
    if (!usesdata) {
 
        message.react('👋')
 
        const modselect = new EmbedBuilder()
        .setColor("#af00fe")
        .setThumbnail()
        .setAuthor({ name: `📞 Modmail système`})
        .setFooter({ text: `📞 Sélection de modmail`})
        .setTimestamp()
        .setTitle('> sélectionner un serveur')
        .addFields({ name: `• Sélectionner un Modmail`, value: `> Veuillez soumettre l’ID du serveur auquel vous êtes \n> en essayant de vous connecter dans la fenêtre modale affichée lorsque \n> en appuyant sur le bouton ci-dessous!`})
        .addFields({ name: `• Comment obtenir l’ID du serveur?`, value: `> Pour obtenir l’ID du serveur, vous devrez activer \n> Mode développeur via les paramètres Discord, puis \n> vous pouvez obtenir l’ID du serveur à droite \n> cliquer sur l’icône du serveur et appuyer sur "Copy Server ID".`})
 
        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('selectmodmail')
            .setLabel('• sélectionnez votre serveur')
            .setStyle(ButtonStyle.Secondary)
        )     
 
        const msg = await message.reply({ embeds: [modselect], components: [button] });
        const selectcollector = msg.createMessageComponentCollector();
 
        selectcollector.on('collect', async i => {
 
            if (i.customId === 'selectmodmail') {
 
                const selectmodal = new ModalBuilder()
                .setTitle('• Modmail Selector')
                .setCustomId('selectmodmailmodal')
 
                const serverid = new TextInputBuilder()
                .setCustomId('modalserver')
                .setRequired(true)
                .setLabel('• À quel serveur voulez-vous vous connecter?')
                .setPlaceholder('exemple: "1078641070180675665"')
                .setStyle(TextInputStyle.Short);
 
                const subject = new TextInputBuilder()
                .setCustomId('subject')
                .setRequired(true)
                .setLabel(`• Pourquoi nous contacter?`)
                .setPlaceholder(`exemple: "Je vous contacte pour X ou Y raison."`)
                .setStyle(TextInputStyle.Paragraph);
 
                const serveridrow = new ActionRowBuilder().addComponents(serverid)
                const subjectrow = new ActionRowBuilder().addComponents(subject)
 
                selectmodal.addComponents(serveridrow, subjectrow)
 
                i.showModal(selectmodal)
 
            }
        })
 
    } else {
 
        if (message.author.client) return;
 
        const sendchannel = await client.channels.cache.get(usesdata.Channel);
        if (!sendchannel) {
 
            message.react('⚠')
            await message.reply('**Oups! ** Votre **modmail** semble **corrompu**, nous l’avons **fermé** pour vous.')
            return await moduses.deleteMany({ User: usesdata.User });
 
        } else {
 
            const msgembed = new EmbedBuilder()
            .setColor("#af00fe")
            .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}`})
            .setFooter({ text: `📞 Modmail Message - ${message.author.id}`})
            .setTimestamp()
            .setDescription(`${message.content || `**Aucun message fourni.**`}`)
 
            if (message.attachments.size > 0) {
 
                try {
                    msgembed.setImage(`${message.attachments.first()?.url}`);
                } catch (err) {
                    return message.react('❌')
                }
 
            }
 
            const user = await sendchannel.guild.members.cache.get(usesdata.User)
            if (!user) {
                message.react('⚠️')
                message.reply(`⚠️ Vous avez quitté **${sendchannel.guild.name}**, votre **modmail** était **fermé**!`)
                sendchannel.send(`⚠️ <@${message.author.id}> à gauche, ce **modmail** a été **fermé**.`)
                return await moduses.deleteMany({ User: usesdata.User })
            }
 
            try {
 
                await sendchannel.send({ embeds: [msgembed] });
 
            } catch (err) {
                return message.react('❌')
            }
 
            message.react('📧')
        }
    }
})
 
client.on(Events.InteractionCreate, async interaction => {
 
    if (!interaction.isModalSubmit()) return;
 
    if (interaction.customId === 'selectmodmailmodal') {
 
        const data = await moduses.findOne({ User: interaction.user.id });
        if (data) return await interaction.reply({ content: `Vous avez **déjà** ouvert un **modmail**! \n> Faites **/modmail close** pour le fermer.`, ephemeral: true });
        else {
 
            const serverid = interaction.fields.getTextInputValue('modalserver');
            const subject = interaction.fields.getTextInputValue('subject');
 
            const server = await client.guilds.cache.get(serverid);
            if (!server) return await interaction.reply({ content: `**Oups! ** Il semble que **serveur** n’existe pas***, ou je suis **pas** dedans!`, ephemeral: true });
 
            const executor = await server.members.cache.get(interaction.user.id);
            if (!executor) return await interaction.reply({ content: `Vous **devez** être membre de **${server.name}** afin d’y **ouvrir** un **modmail**!`, ephemeral: true});
 
            const modmaildata = await modschema.findOne({ Guild: server.id });
            if (!modmaildata) return await interaction.reply({ content: `Le serveur spécifié a son **modmail** système **désactivé**!`, ephemeral: true});
 
            const channel = await server.channels.create({
                name: `modmail-${interaction.user.id}`,
                parent: modmaildata.Category,
 
            }).catch(err => {
                return interaction.reply({ content: `Je **n’ai pas pu** créer votre **modmail** dans **${server.name}**!`, ephemeral: true});
            })
 
            await channel.permissionOverwrites.create(channel.guild.roles.everyone, { ViewChannel: false });
 
            const embed = new EmbedBuilder()
            .setColor("#af00fe")
            .setThumbnail()
            .setAuthor({ name: `📞 Modmail système`})
            .setFooter({ text: `📞 Modmail ouvert`})
            .setTimestamp()
            .setTitle(`> ${interaction.user.username}'s Modmail`)
            .addFields({ name: `• Subject`, value: `> ${subject}`})
 
            const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('deletemodmail')
                .setEmoji('❌')
                .setLabel('Delete')
                .setStyle(ButtonStyle.Secondary),
 
                new ButtonBuilder()
                .setCustomId('closemodmail')
                .setEmoji('🔒')
                .setLabel('Close')
                .setStyle(ButtonStyle.Secondary)
            )
 
            await moduses.create({
                Guild: server.id,
                User: interaction.user.id,
                Channel: channel.id
            })
 
            await interaction.reply({ content: `Votre **modmail** a été ouvert dans **${server.name}**!`, ephemeral: true});
            const channelmsg = await channel.send({ embeds: [embed], components: [buttons] });
            channelmsg.createMessageComponentCollector();
 
        }
    }
})
 
client.on(Events.InteractionCreate, async interaction => {
 
    if (interaction.customId === 'deletemodmail') {
 
        const closeembed = new EmbedBuilder()
        .setColor("#af00fe")
        .setThumbnail()
        .setAuthor({ name: `📞 Modmail système`})
        .setFooter({ text: `📞 Modmail fermé`})
        .setTimestamp()
        .setTitle('> Votre courriel a été fermé')
        .addFields({ name: `• Serveur`, value: `> ${interaction.guild.name}`})
 
        const delchannel = await interaction.guild.channels.cache.get(interaction.channel.id);
        const userdata = await moduses.findOne({ Channel: delchannel.id });
 
        await delchannel.send('❌ **Supprimer** ce **modmail**..')
 
        setTimeout(async () => {
 
            if (userdata) {
 
                const executor = await interaction.guild.members.cache.get(userdata.User)
                if (executor) {
                    await executor.send({ embeds: [closeembed] });
                    await moduses.deleteMany({ User: userdata.User });
                }
 
            }
 
            try {
                await delchannel.delete();
            } catch (err) {
                return;
            }
 
        }, 100)
 
    }
 
    if (interaction.customId === 'closemodmail') {
 
        const closeembed = new EmbedBuilder()
        .setColor("#af00fe")
        .setThumbnail()
        .setAuthor({ name: `📞 Modmail système`})
        .setFooter({ text: `📞 Modmail fermé`})
        .setTimestamp()
        .setTitle('> Votre courriel a été fermé')
        .addFields({ name: `• Server`, value: `> ${interaction.guild.name}`})
 
        const clchannel = await interaction.guild.channels.cache.get(interaction.channel.id);
        const userdata = await moduses.findOne({ Channel: clchannel.id });
 
        if (!userdata) return await interaction.reply({ content: `🔒 Vous avez **déjà** fermé ce **modmail**.`, ephemeral: true})
 
        await interaction.reply('🔒 **Fermé** ce **modmail**..')
 
        setTimeout(async () => {
 
            const executor = await interaction.guild.members.cache.get(userdata.User)
            if (executor) {
 
                try {
                    await executor.send({ embeds: [closeembed] });
                } catch (err) {
                    return;
                }
 
            }
 
            interaction.editReply(`🔒 **Fermé!** <@${userdata.User}> peut **ne plus** voir ce **modmail**, mais vous pouvez!`)
 
            await moduses.deleteMany({ User: userdata.User });
 
        }, 100)
 
    }
})
 
client.on(Events.MessageCreate, async message => {
 
    if (message.author.client) return;
    if (!message.guild) return;
 
    const data = await modschema.findOne({ Guild: message.guild.id });
    if (!data) return;
 
    const sendchanneldata = await moduses.findOne({ Channel: message.channel.id });
    if (!sendchanneldata) return;
 
    const sendchannel = await message.guild.channels.cache.get(sendchanneldata.Channel);
    const member = await message.guild.members.cache.get(sendchanneldata.User);
    if (!member) return await message.reply(`⚠ <@${sendchanneldata.User} est **pas** dans votre **serveur**!`)
 
    const msgembed = new EmbedBuilder()
    .setColor("#af00fe")
    .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}`})
    .setFooter({ text: `📞 Modmail reçu - ${message.author.id}`})
    .setTimestamp()
    .setDescription(`${message.content || `**Aucun message fourni.**`}`)
 
    if (message.attachments.size > 0) {
 
        try {
            msgembed.setImage(`${message.attachments.first()?.url}`);
        } catch (err) {
            return message.react('❌')
        }
 
    }
 
    try {
        await member.send({ embeds: [msgembed] });
    } catch (err) {
        message.reply(`⚠ Je **ne pouvais** message **<@${sendchanneldata.User}>**!`)
        return message.react('❌')
    }
 
    message.react('📧')
 
})
 
client.on(Events.ChannelCreate, async (channel) => {
  const guildId = channel.guild.id;
  const modlog = await Modlog.findOne({ guildId });
 
  if (!modlog || !modlog.logChannelId) {
    return; // if there's no log channel set up, return without sending any log message
}
 
  channel.guild.fetchAuditLogs({ 
    type: AuditLogEvent.ChannelCreate,
  })
    .then(async (audit) => {
      const { executor } = audit.entries.first();
 
      const name = channel.name;
      const id = channel.id;
      let type = channel.type;
 
      if (type == 0) type = 'Text'
      if (type == 2) type = 'Voice'
      if (type == 13) type = 'Stage'
      if (type == 15) type = 'Form'
      if (type == 4) type = 'Announcement'
      if (type == 5) type = 'Category'
 
      const mChannel = await channel.guild.channels.cache.get(modlog.logChannelId);
 
      const embed = new EmbedBuilder()
        .setColor('#af00fe')
        .setTitle('Channel Created')
        .addFields({ name: 'Channel Name', value: `${name} (<#${id}>)`, inline: false })
        .addFields({ name: 'Channel Type', value: `${type} `, inline: true })
        .addFields({ name: 'Channel ID', value: `${id} `, inline: true })
        .addFields({ name: 'Created By', value: `${executor.tag}`, inline: false })
        .setTimestamp()
        .setFooter({ text: 'Mod Logging by ζ͜͡CrowBot Creator [FR]#9108' });
 
    mChannel.send({ embeds: [embed] })
 
    })
})
 
client.on(Events.ChannelDelete, async channel => {
    const Modlog = require('./Schemas/modlog.js');
 
    const guildId = channel.guild.id;
    const modlog = await Modlog.findOne({ guildId });
 
    if (!modlog || !modlog.logChannelId) {
        return; // if there's no log channel set up, return without sending any log message
    }
 
    channel.guild.fetchAuditLogs({
        type: AuditLogEvent.ChannelDelete,
    })
    .then (async audit => {
        const { executor } = audit.entries.first()
 
        const name = channel.name;
        const id = channel.id;
        let type = channel.type;
 
        if (type == 0) type = 'Text'
        if (type == 2) type = 'Voice'
        if (type == 13) type = 'Stage'
        if (type == 15) type = 'Form'
        if (type == 4) type = 'Announcement'
        if (type == 5) type = 'Category'
 
        const mChannel = await channel.guild.channels.cache.get(modlog.logChannelId);
 
    const embed = new EmbedBuilder()
    .setColor("#af00fe")
    .setTitle("Channel Deleted")
    .addFields({ name: "Channel Name", value: `${name}`, inline: false})
    .addFields({ name: "Channel Type", value: `${type} `, inline: true})
    .addFields({ name: "Channel ID", value: `${id} `, inline: true})
    .addFields({ name: "Deleted By", value: `${executor.tag}`, inline: false})
    .setTimestamp()
    .setFooter({ text: "Mod Logging by ζ͜͡CrowBot Creator [FR]#9108"})
 
    mChannel.send({ embeds: [embed] })
 
     })
})
 
client.on(Events.GuildBanAdd, async member => {
    const Modlog = require('./Schemas/modlog.js');
 
    const guildId = member.guild.id;
    const modlog = await Modlog.findOne({ guildId });
 
    if (!modlog || !modlog.logChannelId) {
        return; // if there's no log channel set up, return without sending any log message
    }
 
    member.guild.fetchAuditLogs({
        type: AuditLogEvent.GuildBanAdd,
    })
    .then (async audit => {
        const { executor } = audit.entries.first()
 
        const name = member.user.username;
        const id = member.user.id;
 
 
    const mChannel = await member.guild.channels.cache.get(modlog.logChannelId)
 
    const embed = new EmbedBuilder()
    .setColor("#af00fe")
    .setTitle("Member Banned")
    .addFields({ name: "Member Name", value: `${name} (<@${id}>)`, inline: false})
    .addFields({ name: "Member ID", value: `${id} `, inline: true})
    .addFields({ name: "Banned By", value: `${executor.tag}`, inline: false})
    .setTimestamp()
    .setFooter({ text: "Mod Logging by ζ͜͡CrowBot Creator [FR]#9108"})
 
    mChannel.send({ embeds: [embed] })
 
    })
})
 
client.on(Events.GuildBanRemove, async member => {
    const Modlog = require('./Schemas/modlog.js');
 
    const guildId = member.guild.id;
    const modlog = await Modlog.findOne({ guildId });
 
    if (!modlog || !modlog.logChannelId) {
        return; // if there's no log channel set up, return without sending any log message
    }
 
    member.guild.fetchAuditLogs({
        type: AuditLogEvent.GuildBanRemove,
    })
    .then (async audit => {
        const { executor } = audit.entries.first()
 
        const name = member.user.username;
        const id = member.user.id;
 
 
    const mChannel = await member.guild.channels.cache.get(modlog.logChannelId)
 
    const embed = new EmbedBuilder()
    .setColor("#af00fe")
    .setTitle("Member Unbanned")
    .addFields({ name: "Member Name", value: `${name} (<@${id}>)`, inline: false})
    .addFields({ name: "Member ID", value: `${id} `, inline: true})
    .addFields({ name: "Unbanned By", value: `${executor.tag}`, inline: false})
    .setTimestamp()
    .setFooter({ text: "Mod Logging by ζ͜͡CrowBot Creator [FR]#9108"})
 
    mChannel.send({ embeds: [embed] })
 
    })
})
 
client.on(Events.MessageDelete, async (message) => {
    const Modlog = require('./Schemas/modlog.js');
 
    const guildId = message.guild.id;
    const modlog = await Modlog.findOne({ guildId });
 
    if (!modlog || !modlog.logChannelId) {
        return; // if there's no log channel set up, return without sending any log message
    }
 
    message.guild.fetchAuditLogs({
        type: AuditLogEvent.MessageDelete,
    })
    .then (async audit => {
        const { executor } = audit.entries.first()
 
        const mes = message.content;
 
        if (!mes) return
 
        const mChannel = await message.guild.channels.cache.get(modlog.logChannelId)
 
        const embed = new EmbedBuilder()
        .setColor("#af00fe")
        .setTitle("Suppression de message")
        .addFields({ name: "contenu du message", value: `${mes}`, inline: false})
        .addFields({ name: "canal de messages", value: `${message.channel} `, inline: true})
        .addFields({ name: "supprimés par", value: `${executor.tag}`, inline: false})
        .setTimestamp()
        .setFooter({ text: "Mod Logging by ζ͜͡CrowBot Creator [FR]#9108"})
 
        mChannel.send({ embeds: [embed] })
 
    })
})

client.on(Events.MessageUpdate, async (message, newMessage) => {
    const Modlog = require('./Schemas/modlog.js');
 
    const guildId = message.guild.id;
    const modlog = await Modlog.findOne({ guildId });
 
    if (!modlog || !modlog.logChannelId) {
        return; // if there's no log channel set up, return without sending any log message
    }
 
    message.guild.fetchAuditLogs({
        type: AuditLogEvent.MessageUpdate,
    })
    .then (async audit => {
        const { executor } = audit.entries.first()
 
        const mes = message.content;
 
        if (!mes) return
 
    const mChannel = await message.guild.channels.cache.get(modlog.logChannelId)
 
    const embed = new EmbedBuilder()
    .setColor("#af00fe")
    .setTitle("Message modifié")
    .addFields({ name: "ancien message", value: `${mes}`, inline: false})
    .addFields({ name: "nouveau message", value: `${newMessage} `, inline: true})
    .addFields({ name: "édité par", value: `${executor.tag}`, inline: false})
    .setTimestamp()
    .setFooter({ text: "Mod Logging by ζ͜͡CrowBot Creator [FR]#9108"})
 
    mChannel.send({ embeds: [embed] })
 
    })
})

client.on(Events.MessageBulkDelete, async messages => {
    const Modlog = require('./Schemas/modlog.js');
 
    const guildId = messages.first().guild.id;
    const modlog = await Modlog.findOne({ guildId });
 
    if (!modlog || !modlog.logChannelId) {
        return; // if there's no log channel set up, return without sending any log message
    }
 
    messages.first().guild.fetchAuditLogs({
        type: AuditLogEvent.MessageBulkDelete,
    })
    .then(async audit => {
        const { executor } = audit.entries.first();
 
        const mChannel = await messages.first().guild.channels.cache.get(modlog.logChannelId);
 
        const embed = new EmbedBuilder()
        .setColor("#af00fe")
        .setTitle("Message supprimer en masse")
        .addFields({ name: "canal de messages", value: `${messages.first().channel} `, inline: true})
        .addFields({ name: "Suppression en masse par", value: `${executor.tag}`, inline: false})
        .setTimestamp()
        .setFooter({ text: "Mod Logging by ζ͜͡CrowBot Creator [FR]#9108" });
 
        mChannel.send({ embeds: [embed] });
    });
});

client.on(Events.GuildRoleCreate, async role => {
    const Modlog = require('./Schemas/modlog.js');
 
    const guildId = role.guild.id;
    const modlog = await Modlog.findOne({ guildId });
 
    if (!modlog || !modlog.logChannelId) {
        return; // if there's no log channel set up, return without sending any log message
    }
 
    role.guild.fetchAuditLogs({
        type: AuditLogEvent.RoleCreate,
    })
    .then(async audit => {
        const { executor } = audit.entries.first();
 
        const mChannel = await role.guild.channels.cache.get(modlog.logChannelId);
 
        const embed = new EmbedBuilder()
        .setColor("#af00fe")
        .setTitle("rôle créé")
        .addFields({ name: "nom de rôle", value: `<@&${role.id}> `, inline: true})
        .addFields({ name: "rôle créée par", value: `${executor.tag}`, inline: false})
        .setTimestamp()
        .setFooter({ text: "Mod Logging by ζ͜͡CrowBot Creator [FR]#9108" });
 
        mChannel.send({ embeds: [embed] });
    });
});

client.on(Events.GuildRoleDelete, async role => {
    const Modlog = require('./Schemas/modlog.js');
 
    const guildId = role.guild.id;
    const modlog = await Modlog.findOne({ guildId });
 
    if (!modlog || !modlog.logChannelId) {
        return; // if there's no log channel set up, return without sending any log message
    }
 
    role.guild.fetchAuditLogs({
        type: AuditLogEvent.RoleDelete,
    })
    .then(async audit => {
        const { executor } = audit.entries.first();
 
        const mChannel = await role.guild.channels.cache.get(modlog.logChannelId);
 
        const embed = new EmbedBuilder()
        .setColor("#af00fe")
        .setTitle("Rôle supprimé")
        .addFields({ name: "nom de rôle", value: `${role.name} (${role.id})`, inline: true})
        .addFields({ name: "Rôle supprimé par", value: `${executor.tag}`, inline: false})
        .setTimestamp()
        .setFooter({ text: "Mod Logging by ζ͜͡CrowBot Creator [FR]#9108" });
 
        mChannel.send({ embeds: [embed] });
    });
});

client.on(Events.GuildMemberAdd, async member => {
    const Modlog = require('./Schemas/modlog.js');
 
    const guildId = member.guild.id;
    const modlog = await Modlog.findOne({ guildId });
 
    if (!modlog || !modlog.logChannelId) {
        return; // if there's no log channel set up, return without sending any log message
    }
 
    const mChannel = await member.guild.channels.cache.get(modlog.logChannelId);
 
    const embed = new EmbedBuilder()
        .setColor("#af00fe")
        .setTitle("membre a rejoint")
        .addFields({ name: "nom d'utilisateur", value: `${member.user.username}#${member.user.discriminator} (${member.user.id})`, inline: true})
        .addFields({ name: "rejoint à", value: `${member.joinedAt.toUTCString()}`, inline: true})
        .setTimestamp()
        .setFooter({ text: "Mod Logging by ζ͜͡CrowBot Creator [FR]#9108" });
 
    mChannel.send({ embeds: [embed] });
});

client.on(Events.GuildMemberRemove, async member => {
    const Modlog = require('./Schemas/modlog.js');
 
    const guildId = member.guild.id;
    const modlog = await Modlog.findOne({ guildId });
 
    if (!modlog || !modlog.logChannelId) {
        return; // if there's no log channel set up, return without sending any log message
    }
 
    const mChannel = await member.guild.channels.cache.get(modlog.logChannelId);
 
    const embed = new EmbedBuilder()
        .setColor("#af00fe")
        .setTitle("membre a quitté")
        .addFields({ name: "nom d'utilisateur", value: `${member.user.username}#${member.user.discriminator} (${member.user.id})`, inline: true})
        .addFields({ name: "Laissé à", value: `${new Date().toUTCString()}`, inline: true})
        .setTimestamp()
        .setFooter({ text: "Mod Logging by ζ͜͡CrowBot Creator [FR]#9108" });
 
    mChannel.send({ embeds: [embed] });
});
 
client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
    if (oldMember.nickname === newMember.nickname) {
        return; // if the nickname hasn't changed, return without sending any log message
    }
 
    const Modlog = require('./Schemas/modlog.js');
 
    const guildId = newMember.guild.id;
    const modlog = await Modlog.findOne({ guildId });
 
    if (!modlog || !modlog.logChannelId) {
        return; // if there's no log channel set up, return without sending any log message
    }
 
    const mChannel = await newMember.guild.channels.cache.get(modlog.logChannelId);
 
    const embed = new EmbedBuilder()
        .setColor("#af00fe")
        .setTitle("Changement de surnom")
        .addFields({ name: "nom d'utilisateur", value: `${newMember.user.username}#${newMember.user.discriminator} (${newMember.user.id})`, inline: true })
        .addFields({ name: "ancien surnom", value: `${oldMember.nickname ? oldMember.nickname : 'None'}`, inline: true })
        .addFields({ name: "nouveau surnom", value: `${newMember.nickname ? newMember.nickname : 'None'}`, inline: true })
        .setTimestamp()
        .setFooter({ text: "Mod Logging by ζ͜͡CrowBot Creator [FR]#9108" });
 
    mChannel.send({ embeds: [embed] });
});
 
client.on(Events.UserUpdate, async (oldUser, newUser) => {
    if (oldUser.username === newUser.username) {
        return; // if the username hasn't changed, return without sending any log message
    }
 
    const Modlog = require('./Schemas/modlog.js');
 
    const guildId = newUser.guild;
    const modlog = await Modlog.findOne({ guildId });
 
    if (!modlog || !modlog.logChannelId) {
        return; // if there's no log channel set up, return without sending any log message
    }
 
    const mChannel = await newUser.guild.channels.cache.get(modlog.logChannelId);
 
    const embed = new EmbedBuilder()
        .setColor("#af00fe")
        .setTitle("Nom d’utilisateur modifié")
        .addFields({ name: "utilisateur", value: `${newUser.username}#${newUser.discriminator} (${newUser.id})`, inline: true })
        .addFields({ name: "ancien nom d'utilisateur", value: `${oldUser.username}`, inline: true })
        .addFields({ name: "nouveau nom d'utilisateur", value: `${newUser.username}`, inline: true })
        .setTimestamp()
        .setFooter({ text: "Mod Logging by ζ͜͡CrowBot Creator [FR]#9108" });
 
    mChannel.send({ embeds: [embed] });
});
 
client.on(Events.UserUpdate, async (oldUser, newUser) => {
    if (oldUser.avatar === newUser.avatar) {
        return; // if the avatar hasn't changed, return without sending any log message
    }
 
    const Modlog = require('./Schemas/modlog.js');
 
    const guildId = newUser.guild;
    const modlog = await Modlog.findOne({ guildId });
 
    if (!modlog || !modlog.logChannelId) {
        return; // if there's no log channel set up, return without sending any log message
    }
 
    const mChannel = await newUser.guild.channels.cache.get(modlog.logChannelId);
 
    const embed = new EmbedBuilder()
        .setColor("#af00fe")
        .setTitle("Avatar changé")
        .setDescription(`**utilisateur:** ${newUser.username}#${newUser.discriminator} (${newUser.id})`)
        .setImage(newUser.displayAvatarURL({ format: "png", dynamic: true }))
        .setTimestamp()
        .setFooter({ text: "Mod Logging by ζ͜͡CrowBot Creator [FR]#9108" });
 
    mChannel.send({ embeds: [embed] });
});
 
client.on(Events.GuildMemberRemove, async (member) => {
    const Modlog = require('./Schemas/modlog.js');
 
    const guildId = member.guild.id;
    const modlog = await Modlog.findOne({ guildId });
 
    if (!modlog || !modlog.logChannelId) {
        return; // if there's no log channel set up, return without sending any log message
    }
 
    member.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberKick,
    })
    .then (async audit => {
 
        const { executor } = audit.entries.first();
 
    const mChannel = await member.guild.channels.cache.get(modlog.logChannelId);
 
    const embed = new EmbedBuilder()
        .setColor("#af00fe")
        .setTitle("Membre kick")
        .addFields({ name: 'utilisateur', value: `${member.user.username}#${member.user.discriminator} (${member.user.id})` })
        .addFields({ name: "kick par", value: `${executor.tag}`, inline: false})
        .setFooter({ text: "Mod Logging by ζ͜͡CrowBot Creator [FR]#9108" });
 
    mChannel.send({ embeds: [embed] });
    })
});
 
client.on(Events.InviteCreate, async (invite) => {
    const Modlog = require('./Schemas/modlog.js');
 
    const guildId = invite.guild.id;
    const modlog = await Modlog.findOne({ guildId });
 
    if (!modlog || !modlog.logChannelId) {
        return; // if there's no log channel set up, return without sending any log message
    }
 
    const mChannel = await invite.guild.channels.cache.get(modlog.logChannelId);
 
    const embed = new EmbedBuilder()
        .setColor("#af00fe")
        .setTitle("Invitation créée")
        .addFields({ name: "Code", value: `${invite.code}`, inline: true })
        .addFields({ name: "canal", value: `${invite.channel}`, inline: true })
        .addFields({ name: "hôte", value: `${invite.inviter}`, inline: true })
        .setTimestamp()
        .setFooter({ text: "Mod Logging by ζ͜͡CrowBot Creator [FR]#9108" });
 
    mChannel.send({ embeds: [embed] });
});
 
client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
    const Modlog = require('./Schemas/modlog.js');
 
    const guildId = newMember.guild.id;
    const modlog = await Modlog.findOne({ guildId });
 
    if (!modlog || !modlog.logChannelId) {
        return; // if there's no log channel set up, return without sending any log message
    }
    newMember.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberUpdate,
    })
    .then (async audit => {
 
        const { executor } = audit.entries.first();
 
        const mChannel = await newMember.guild.channels.cache.get(modlog.logChannelId);
 
        if (oldMember.roles.cache.size < newMember.roles.cache.size) {
          const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
          const roleNameArray = addedRoles.map(role => `<@&${role.id}>`);
          const rolesAddedString = roleNameArray.join(", ");
 
          const embed = new EmbedBuilder()
            .setColor("#af00fe")
            .setTitle("Rôle ajoutés")
            .addFields(
              { name: "utilisateur", value: `<@${newMember.id}>`, inline: true },
              { name: "Rôle ajoutés", value: rolesAddedString, inline: true },
              { name: "Rôle ajoutés par", value: `${executor.tag}`, inline: false }
            )
            .setTimestamp()
            .setFooter({ text: "Mod Logging by ζ͜͡CrowBot Creator [FR]#9108"});
 
          mChannel.send({ embeds: [embed] });
        }
    })
});
 
client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
    const Modlog = require('./Schemas/modlog.js');
 
    const guildId = newMember.guild.id;
    const modlog = await Modlog.findOne({ guildId });
 
    if (!modlog || !modlog.logChannelId) {
        return; // if there's no log channel set up, return without sending any log message
    }
 
    newMember.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberRoleUpdate,
    })
    .then (async audit => {
 
        const { executor } = audit.entries.first();
        const mChannel = await newMember.guild.channels.cache.get(modlog.logChannelId);
 
        if (oldMember.roles.cache.size > newMember.roles.cache.size) {
            const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
            const roleNameArray = removedRoles.map(role => `<@&${role.id}>`);
            const rolesRemovedString = roleNameArray.join(", ");
 
            const embed = new EmbedBuilder()
                .setColor("#af00fe")
                .setTitle("Rôles supprimés")
                .addFields(
                    { name: "utilisateur", value: `<@${newMember.id}>`, inline: true },
                    { name: "Rôles supprimés", value: rolesRemovedString, inline: true },
                    { name: "Role supprimés par", value: `${executor.tag}`, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: "Mod Logging by ζ͜͡CrowBot Creator [FR]#9108"});
 
            mChannel.send({ embeds: [embed] });
        }
    });
});
  
const embed = new Discord.EmbedBuilder()
  .setTitle(`Redémarrage FastHaul Logistic`)
  .setDescription(`> **Status**: 🟢ON
  > **Nom du bot:** FastHaul Logistic,
  > **Redémarré le:** ${restart},
  > **Il y a environ:** <t:${parseInt(Date.now() / 1000)}:R>,
  > **Commandes total:** ${client.commands.size} Commands,
  > **Nombre de serveurs en total:** ${client.guilds.cache.size} serveurs,
  > **Version D.JS:** V${djsversion},
  > **Version de Node.JS:** ${process.version},
  
Mise a jour de FastHaul Logistic fini avec succès.`)
  .setColor("#af00fe")
  .setImage('https://imgur.com/DQAfUSF.png')
  
webhookClient.send({
    username: "FastHaul Logistic",
    avatarURL: 'https://imgur.com/DQAfUSF.png',
    embeds: [embed],
});
 
client.on(Events.InteractionCreate, async i => {
  if (i.isButton()) {
      if (i.customId === 'staffButton') {
          const embed = new EmbedBuilder()
              .setColor('Green')
              .setDescription('Votre demande a commencé dans vos DM. Veuillez y répondre le plus rapidement possible..');
 
          const member = i.member;
 
          const ongoingApplication = await StaffMessages.findOne({ User: member.id, inProgress: true });
 
          if (ongoingApplication) {
            const embed = new EmbedBuilder()
                .setColor('#af00fe')
                .setDescription('Vous avez déjà une demande en cours. Veuillez la remplir avant d’en commencer une nouvelle..');
 
            return i.reply({ embeds: [embed], ephemeral: true });
        }
 
          if (cooldowns.has(member.id)) {
 
            const duration = await StaffMessages.findOne({ Guild: i.guild.id});
 
            const cooldownTime = ms(duration.Duration);
            const currentTime = new Date().getTime();
            const timeDifference = currentTime - cooldowns.get(member.id);
    
            if (timeDifference < cooldownTime) {
 
              const remainingTimeInSeconds = Math.ceil((cooldownTime - timeDifference) / 1000);
              const remainingDays = Math.floor(remainingTimeInSeconds / 86350);
              const remainingHours = Math.floor((remainingTimeInSeconds % 86350) / 3600);
              const remainingMinutes = Math.floor((remainingTimeInSeconds % 3600) / 60);
              const remainingSeconds = remainingTimeInSeconds % 60;
              
              const remainingTime = `${remainingDays} days, ${remainingHours} hours, ${remainingMinutes} minutes, ${remainingSeconds} seconds`;
  
              return await i.reply({ content: `You have to wait ${remainingTime} before starting a new application process.`, ephemeral: true });
            }
          }
 
          const botUser = client.user;
          const botAvatar = botUser.avatarURL();
 
          member.send({ 
            embeds: [
              new EmbedBuilder()
                .setColor('#af00fe')
                .setTitle('Staff Application')
                .setURL('https://discord.com/oauth2/authorize?client_id=1106144039109132329&permissions=8&scope=bot%20applications.commands')
                .setDescription(`Merci de votre intérêt à devenir membre du personnel de notre serveur. Pour commencer le processus de demande du personnel, veuillez répondre à ce message par **yes**. Si vous souhaitez annuler la demande à tout moment, il vous suffit de répondre par un message autre que **yes**.`)
                .addFields(
                  { name: '👍 Tips 👍', value: 'Soyez honnête, détaillé et respectueux dans vos réponses. Montrez-nous pourquoi vous êtes un bon candidat pour notre équipe et ce que vous pouvez apporter à notre communauté.' }
                )
                .setThumbnail(botAvatar)
            ]
          }).then( async () => {
            i.reply({ embeds: [embed], ephemeral: true });
 
            cooldowns.set(member.id, new Date().getTime());
            
            const staffMessage = await StaffMessages.create({
              Guild: i.guild.id,
              User: member.id,
              Messages: '',
              QuestionNumber: 0,
              inProgress: true              
            });
            await staffMessage.save();
          }).catch(err => {
            i.reply({ content: "Vous devez permettre à vos DM d’interagir avec ce bouton..", ephemeral: true });
          });
          
 
          const missingQuestionNumber = await StaffMessages.find({ QuestionNumber: { $exists: false } });
          
          for (const doc of missingQuestionNumber) {
              doc.QuestionNumber = 1;
              await doc.save();
          }
      }
  }
});
 
client.on(Events.MessageCreate, async message => {
  if (message.channel.type == ChannelType.DM) {
 
    const member = message.author
 
      const staffMessage = await StaffMessages.findOne({ User: member.id });
      
      if (staffMessage) {
 
        if (message.content.toLowerCase() === 'yes') {
        } else if (staffMessage.QuestionNumber === 0) {
          member.send({ content: `Votre demande a été annulée.` }).catch(err => {
            return;
        })
          await StaffMessages.deleteMany({ User: member.id });
          return;
        }
 
        const questioning = await StaffMessages.findOne({ Guild: staffMessage.Guild });
 
        const question1 = questioning.Question1
        const question2 = questioning.Question2
        const question3 = questioning.Question3
        const question4 = questioning.Question4
        const question5 = questioning.Question5
        const question6 = questioning.Question6
        const question7 = questioning.Question7
        const question8 = questioning.Question8
        const question9 = questioning.Question9
        const question10 = questioning.Question10
 
        let questions = [
          question1,
          question2,
          question3,
          question4,
          question5,
          question6,
          question7,
          question8,
          question9,
          question10
        ].filter((question) => question !== undefined && question !== null);
 
          staffMessage.Messages += `${message.content}\n`;
          staffMessage.QuestionNumber += 1;
          await staffMessage.save();
 
          if (staffMessage.QuestionNumber <= questions.length) {
            let currentQuestion = questions[staffMessage.QuestionNumber - 1];
            if (currentQuestion !== undefined && currentQuestion !== null) {
              const botUser = client.user;
              const botAvatar = botUser.avatarURL();
              
              const questionEmbed = new EmbedBuilder()
                .setColor('#af00fe')
                .setAuthor({
                  name: 'Staff Application',
                  iconURL: botAvatar,
                  url: 'https://discord.com/oauth2/authorize?client_id=1106144039109132329&permissions=8&scope=bot%20applications.commands'
                })
                .setTitle(`Question ${staffMessage.QuestionNumber}`)
                .setDescription(currentQuestion)
                .addFields({ name: 'Note', value: 'Veuillez limiter votre réponse à 350 caractères ou moins.' })
                .setThumbnail(botAvatar)
                .setFooter({ text:'Merci de vous joindre à notre équipe..'})
                .setTimestamp()
 
                member.send({ embeds: [questionEmbed] }).catch(err => {
                  return;
              })
            }
          } else {
 
            await StaffMessages.deleteMany({ User: member.id });
 
            const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('demande complète :white_check_mark:')
            .setDescription('Votre demande a été envoyée et sera examinée par les modérateurs..')
  
            member.send({ embeds: [embed] }).catch(err => {
              return;
          })
 
            let messages = staffMessage.Messages.split('\n');
 
            let appQuestion1 = messages[1];
            let appQuestion2 = messages[2];
            let appQuestion3 = messages[3];
            let appQuestion4 = messages[4];
            let appQuestion5 = messages[5];
            let appQuestion6 = messages[6];
            let appQuestion7 = messages[7];
            let appQuestion8 = messages[8];
            let appQuestion9 = messages[9];
            let appQuestion10 = messages[10];
 
            const applicationsEmbed = new EmbedBuilder()
            .setColor('#af00fe')
            .setTitle(`Staff Application`)
            .setDescription(`Application from ${member.username}`)
            .addFields(
              { name: 'Discord Name', value: `${member.tag} - ${member}`, inline: true },
              { name: 'Discord ID', value: `${member.id}`, inline: true },
              { name: "Joined Discord",value:`<t:${parseInt(member.createdAt/1000)}:f>\n (<t:${parseInt(member.createdAt/1000)}:R>)`,inline:true},
              { name: '\u200B\n', value: '\u200B\n', inline: false }
            );
          
            if (appQuestion1) {
              if (appQuestion1.length > 350) {
                appQuestion1 = 'Answer was too long';
              }
              applicationsEmbed.addFields({ name: 'Question 1', value: appQuestion1, inline: true });
            }
            if (appQuestion2) {
              if (appQuestion2.length > 350) {
                appQuestion2 = 'Answer was too long';
              }
              applicationsEmbed.addFields({ name: 'Question 2', value: appQuestion2, inline: true });
            }
            if (appQuestion3) {
              if (appQuestion3.length > 350) {
                appQuestion3 = 'Answer was too long';
              }
              applicationsEmbed.addFields({ name: 'Question 3', value: appQuestion3, inline: true });
              applicationsEmbed.addFields({ name: '\u200B\n', value: '\u200B\n', inline: false });
            }
              if (appQuestion4) {
                if (appQuestion4.length > 350) {
                  appQuestion4 = 'Answer was too long';
                }
                applicationsEmbed.addFields({ name: 'Question 4', value: appQuestion4, inline: true });
              }
              if (appQuestion5) {
                if (appQuestion5.length > 350) {
                  appQuestion5 = 'Answer was too long';
                }
                applicationsEmbed.addFields({ name: 'Question 5', value: appQuestion5, inline: true });
              }
              if (appQuestion6) {
                if (appQuestion6.length > 350) {
                  appQuestion6 = 'Answer was too long';
                }
                applicationsEmbed.addFields({ name: 'Question 6', value: appQuestion6, inline: true });
                applicationsEmbed.addFields({ name: '\u200B\n', value: '\u200B\n', inline: false });
              }
              if (appQuestion7) {
                if (appQuestion7.length > 350) {
                  appQuestion7 = 'Answer was too long';
                }
                applicationsEmbed.addFields({ name: 'Question 7', value: appQuestion7, inline: true });
              }
              if (appQuestion8) {
                if (appQuestion8.length > 350) {
                  appQuestion8 = 'Answer was too long';
                }
                applicationsEmbed.addFields({ name: 'Question 8', value: appQuestion8, inline: true });
              }
              if (appQuestion9) {
                if (appQuestion9.length > 350) {
                  appQuestion9 = 'Answer was too long';
                }
                applicationsEmbed.addFields({ name: 'Question 9', value: appQuestion9, inline: true });
                applicationsEmbed.addFields({ name: '\u200B\n', value: '\u200B\n', inline: false });
              }
              if (appQuestion10) {
                if (appQuestion10.length > 350) {
                  appQuestion10 = 'Answer was too long';
                }
                applicationsEmbed.addFields({ name: 'Question 10', value: appQuestion10, inline: true });
              }
          
          applicationsEmbed.setTimestamp();
 
          const staffSchema = await StaffSchema.findOne({ GuildID: staffMessage.Guild });
 
          const channel = client.channels.cache.get(staffSchema.Transcripts);
 
          const message = await channel.send({ embeds: [applicationsEmbed], content: staffSchema.Role ? `<@&${staffSchema.Role}>` : null });
 
          const thread = await message.startThread({
              name: 'New Staff Application',
              autoArchiveDuration: 10080,
          });
  
          const threadReplyEmbed = new EmbedBuilder()
              .setColor('#af00fe')
              .setTitle('New Staff Application')
              .setDescription('A new staff application has been submitted.')
              .setTimestamp();
  
          await thread.send({ embeds: [threadReplyEmbed] });
 
          }
      }
  }
});

client.on('guildCreate', guild => {
    const topChannel = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).sort((a, b) => a.rawPosition - b.rawPosition || a.id - b.id).first();
   
    try {
      const embed = new EmbedBuilder()
          .setColor("#af00fe")
          .setTitle("Plop 👋")
          .setDescription(`Salut, je m'appelle <@1104339881632735266>.
          Je suis un bot polyvalent français et je pense pouvoir améliorer ton serveur !
          
          Je possède de nombreuses commandes, toutes visibles avec la commande **/aide**
          
          **Pour répondre au mieux à tes besoins, tu peux me configurer facilement avec la commande __/logs-setup__**`)
          .setTimestamp()
          const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('Support Server')
            .setURL('https://discord.gg/gqTE8m2f9n')
        );
      topChannel.send({ embeds: [embed], components: [row]  });
    } catch (error) {
      console.error(error);
    }
  });

client.on(Events.InteractionCreate, async interaction => {

  if (!interaction.customId === 'select') {
    let choices = "";

    await interaction.values.forEach(async value => {
      choices += `${value}`
    })

    await interaction.reply({ content: `${choices}`})
  }
})

// Leave Message //
 
client.on(Events.GuildMemberRemove, async (member, err) => {
 
  const leavedata = await welcomeschema.findOne({ Guild: member.guild.id });

  if (!leavedata) return;
  else {

      const channelID = leavedata.Channel;
      const channelwelcome = member.guild.channels.cache.get(channelID);

      const embedleave = new EmbedBuilder()
      .setColor("DarkBlue")
      .setTitle(`${member.user.username} has left`)
      .setDescription( `> ${member} has left the Server`)
      .setFooter({ text: `👋 Cast your goobyes`})
      .setTimestamp()
      .setAuthor({ name: `👋 Member Left`})
      .setThumbnail('https://imgur.com/DQAfUSF.png')

      const welmsg = await channelwelcome.send({ embeds: [embedleave]}).catch(err);
      welmsg.react('👋');
  }
})

// Welcome Message //

client.on(Events.GuildMemberAdd, async (member, err) => {

  const welcomedata = await welcomeschema.findOne({ Guild: member.guild.id });

  if (!welcomedata) return;
  else {

      const channelID = welcomedata.Channel;
      const channelwelcome = member.guild.channels.cache.get(channelID)
      const roledata = await roleschema.findOne({ Guild: member.guild.id });

      if (roledata) {
          const giverole = await member.guild.roles.cache.get(roledata.Role)

          member.roles.add(giverole).catch(err => {
              console.log('Erreur reçue en essayant de donner un rôle automatique!');
          })
      }

      const embedwelcome = new EmbedBuilder()
       .setColor("#af00fe")
       .setTitle(`${member.user.username}`)
       .setDescription(`🎉  Bienvenue ${member.user.username}  🎉!`)
       .setImage('https://imgur.com/DQAfUSF.png')

      const embedwelcomedm = new EmbedBuilder()
       .setColor("#af00fe")
       .setTitle(`${member.user.username}`)
       .setDescription(`🎉  Bienvenue ${member.user.username}  🎉!`)
      .setImage('https://imgur.com/DQAfUSF.png')

      const levmsg = await channelwelcome.send({ embeds: [embedwelcome]});
      levmsg.react('👋');
      member.send({ embeds: [embedwelcomedm]}).catch(err => console.log(`Welcome DM error: ${err}`))

  } 
})

client.on(Events.InteractionCreate, async (interaction) => {
  const { customId, guild, channel } = interaction;
  if (interaction.isButton()) {
    if (customId === "ticket") {
      let data = await ticketSchema.findOne({
        GuildID: interaction.guild.id,
      });
 
      if (!data) return await interaction.reply({ content: "Ticket system is not setup in this server", ephemeral: true })
      const role = guild.roles.cache.get(data.Role)
      const cate = data.Category;
 
 
      await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        parent: cate,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: ["ViewChannel"]
          },
          {
            id: role.id,
            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
          },
          {
            id: interaction.member.id,
            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
          },
        ],
      }).then(async (channel) => {
        const openembed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("Ticket Opened")
          .setDescription(`Welcome to your ticket ${interaction.user.username}\n React with 🔒 to close the ticket`)
          .setThumbnail(interaction.guild.iconURL())
          .setTimestamp()
          .setFooter({ text: `${interaction.guild.name}'s Tickets` })
 
          const closeButton = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
            .setCustomId('closeticket')
            .setLabel('Close')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🔒')
          )
          await channel.send({ content: `<@&${role.id}>`, embeds: [openembed], components: [closeButton] })
 
          const openedTicket = new EmbedBuilder()
          .setDescription(`Ticket created in <#${channel.id}>`)
 
          await interaction.reply({ embeds: [openedTicket], ephemeral: true })
      })
    }
 
    if (customId === "closeticket") {
      const closingEmbed = new EmbedBuilder()
      .setDescription('🔒 are you sure you want to close this ticket?')
      .setColor('Red')
 
      const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId('yesclose')
        .setLabel('Yes')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('✅'),
 
        new ButtonBuilder()
        .setCustomId('nodont')
        .setLabel('No')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('❌')
      )
 
      await interaction.reply({ embeds: [closingEmbed], components: [buttons] })
    }
 
    if (customId === "yesclose") {
      let data = await ticketSchema.findOne({ GuildID: interaction.guild.id });
      const transcript = await createTranscript(channel, {
        limit: -1,
        returnBuffer: false,
        filename: `ticket-${interaction.user.username}.html`,
      });
 
      const transcriptEmbed = new EmbedBuilder()
      .setAuthor({ name: `${interaction.guild.name}'s Transcripts`, iconURL: guild.iconURL() })
      .addFields(
        {name: `Closed by`, value: `${interaction.user.tag}`}
      )
      .setColor('Red')
      .setTimestamp()
      .setThumbnail(interaction.guild.iconURL())
      .setFooter({ text: `${interaction.guild.name}'s Tickets` })
 
      const processEmbed = new EmbedBuilder()
      .setDescription(` Closing ticket in 10 seconds...`)
      .setColor('Red')
 
      await interaction.reply({ embeds: [processEmbed] })
 
      await guild.channels.cache.get(data.Logs).send({
        embeds: [transcriptEmbed],
        files: [transcript],
      });
 
      setTimeout(() => {
        interaction.channel.delete()
      }, 10000);
     }
 
     if (customId === "nodont") {
        const noEmbed = new EmbedBuilder()
        .setDescription('🔒 Ticket close cancelled')
        .setColor('Red')
  
        await interaction.reply({ embeds: [noEmbed], ephemeral: true })
     }
  }
})

client.on(Events.InteractionCreate, async interaction => {

  if (!interaction) return;
  if (!interaction.isChatInputCommand()) return;
  else {

    const channel = await client.channels.cache.get('1109603136399753246');
    const server = interaction.guild.name;
    const user = interaction.user.username;
    const userID = interaction.user.id;

    const embed = new EmbedBuilder()
    .setColor("#af00fe")
    .setTitle('Chat command used !')
    .addFields({ name: 'Server name', value: `${server}`})
    .addFields({ name: 'Chat command', value: `${interaction}`})
    .addFields({ name: 'Command user', value: `${user} / ${userID}`})
    .setTimestamp()
    .setFooter({ text: 'Chat command executed'})

    await channel.send({ embeds: [embed] });
  }
})

client.on(Events.GuildCreate, async guild => {

  const channel = await client.channels.cache.get('1107629114044723272');
  const name = guild.name;
  const memberCount = guild.memberCount;
  const ownerID = guild.ownerId;
  const owner = await client.users.cache.get(ownerID);
  const ownerName = owner.username;

  const embed = new EmbedBuilder()
  .setColor('Green')
  .setTitle('😁 Nouveau serveur rejoins')
  .addFields({ name: 'Server name', value: `> ${name}`})
  .addFields({ name: 'Server members', value: `> ${memberCount}`})
  .addFields({ name: 'Server owner', value: `> ${ownerName} / ${owner}`})
  .addFields({ name: 'Server age', value: `> <t:${parseInt(guild.createdTimestamp /1000)}:R>`})
  .setTimestamp()
  .setFooter({ text: 'Serveur rejoins' })

  await channel.send({ embeds: [embed] })
})

client.on(Events.GuildDelete, async guild => {

  const channel = await client.channels.cache.get('1107629114044723273');
  const name = guild.name;
  const memberCount = guild.memberCount;
  const ownerID = guild.ownerId;
  const owner = await client.users.cache.get(ownerID);
  const ownerName = owner.username;

  const embed = new EmbedBuilder()
  .setColor('Red')
  .setTitle("😮 Départ d'un serveur")
  .addFields({ name: 'Server name', value: `> ${name}`})
  .addFields({ name: 'Server members', value: `> ${memberCount}`})
  .addFields({ name: 'Server owner', value: `> ${ownerName} / ${owner}`})
  .addFields({ name: 'Server age', value: `> <t:${parseInt(guild.createdTimestamp /1000)}:R>`})
  .setTimestamp()
  .setFooter({ text: 'Départ' })

  await channel.send({ embeds: [embed] })
})

client.on(Events.MessageCreate, async message => {

  if (message.channel.type !== ChannelType.GuildAnnouncement) return;
  if (message.author.bot) return;
  if (message.content.startsWith('.')) return;
  else {

    const data = await publishschema.findOne({ Guild: message.guild.id});

    if (!data) return;
    if (!data.Channel.includes(message.channel.id)) return;

    try {
      message.crosspost();
    } catch (e) {
      return;
    }
  }
})

  client.on(Events.InteractionCreate, async interaction => {
 
    const helprow2 = new ActionRowBuilder()
        .addComponents(
 
            new StringSelectMenuBuilder()
            .setMinValues(1)
            .setMaxValues(1)
            .setCustomId('selecthelp')
            .setPlaceholder('🏠Acceuil')
            .addOptions(
              {
                label: '🏠Acceuil',
                description: 'Navigate to the Help Center.',
                value: 'helpacceuil',
              },
              {
                label: '🗂️Administrations',
                description: 'Navigate to the Help Center.',
                value: 'helpadmin',
              },

              {
                label: 'ℹ️Informations',
                description: 'Navigate to the Tickets page.',
                value: 'helpinfo'
              },

              {
                label: 'ℹ️Informations',
                description: 'Navigate to the Tickets page.',
                value: 'helpjeux'
              },

              {
                label: '🛠️Modérations',
                description: 'Navigate to the Commands help page.',
                value: 'helpmod',
              },

              {
                label: '👥Public',
                description: 'Navigate to the Commands help page.',
                value: 'helppublic',
              },
            ),
        );
 
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId === 'selecthelp') {
        let choices = "";
 
        const helpacceuil = new EmbedBuilder()
        .setColor('#af00fe')
        .setTitle('🏠Accueil')
        .setDescription(`-Utilisez </aide:1106243591501787186> pour afficher toutes les commandes.
        **Quelques liens utiles** :`)
        .setImage('https://imgur.com/DQAfUSF.png')
 
        interaction.values.forEach(async (value) => {
            choices += `${value}`;
 
            if (value === 'helpacceuil') {
 
                await interaction.update({ embeds: [helpacceuil] });
            }

            if (value === 'helpadmin') {
 
              const helpadmin = new EmbedBuilder()
              .setColor('#af00fe')
              .setTitle('Voici ma liste de commande **ADMIN**')
              .addFields({ name: '✅</ajoutée-emoji-role:1108722867237048342>', value: 'Ajoute un emoji à un rôle spécifique,'})
              .addFields({ name: '✅</annonce:1108722867237048343>', value: 'Envoyer une annonce à un canal spécifique,'})
              .addFields({ name: '✅</applications-setup:1108722867237048344>', value: 'Créer un système d’applications,'})
              .addFields({ name: '✅</auto-publication ajouter-autpublication:1108722867832623227>, ✅</auto-publication supprimer-autopublication:1108722867832623227>', value: 'Configurer et désactiver votre système d’édition automatique,'})
              .addFields({ name: '✅</auto-role définir:1108722867832623228>, ✅</auto-role supprimer:1108722867832623228>', value: 'Configurer un rôle automatique qui est donné à vos membres lors de l’adhésion,'})
              .addFields({ name: '✅</bienvenue-config définir:1108722867832623229>, ✅</bienvenue-config retirer:1108722867832623229>', value: 'Configurer le canal d’accueil de votre serveur,'})
              .addFields({ name: '✅</bienvenue définir:1108722867832623230>, ✅</bienvenue supprimer:1108722867832623230>', value: 'Configurer un message de bienvenue,'})
              .addFields({ name: '✅</gérer-salon éditer:1108722867832623233>, ✅</gérer-salon salon:1108722867832623233>, ✅</gérer-salon supprimer:1108722867832623233>', value: 'Créer ou supprimer un canal,'})
              .addFields({ name: '✅</créer-vocal configuration:1108722867832623232>, ✅</créer-vocal désactivé:1108722867832623232>', value: 'creer un canal vocal,'})
              .addFields({ name: '✅</embed:1108722867832623234>', value:'Crée un embed,'})
              .addFields({ name: '✅</modmail configuration:1108722868197535805>, ✅</modmail fermer:1108722868197535805>, ✅</modmail désactiver:1108722868197535805>', value: 'Configurer votre système modmail,'})
              .addFields({ name: '✅</ping-staff staff:1109531673273565265>', value: 'Gérer le système ping staff,'})
              .addFields({ name: '✅</ping-staff:1109531673273565265>', value :'Ping en ligne des membres du personnel,'})
              .addFields({ name: ':x:</role-react:>', value: 'Donne un rôle quan dun membre clique sur la réaction,'})
              .addFields({ name: '✅</say:1108722868197535807>', value: 'Dire quelque chose via le bot,'})
              .addFields({ name: '✅</ticket-config:1108722868197535808>', value: 'Configurer le système de ticket pour le serveur,'})
              .addFields({ name: '✅</ticket-stop:1108722868197535809>', value: 'Désactive le système de ticket pour le serveur,'})
              .addFields({ name: '✅</ticket:1109601125704945736>', value: 'Une commande pour configurer un ou plusieurs système de tickets,'})
              .addFields({ name: '✅</verification-serv configuration:1108722868197535810>, ✅</verification-serv désactiver:1108722868197535810>', value: 'Configurez votre système de vérification en utilisant captcha.'})
              
              await interaction.update({ embeds: [helpadmin] });
          }

            if (value === 'helpinfo') {
 
                const helpinfo = new EmbedBuilder()
                .setColor('#af00fe')
                .setTitle('Voici ma liste de commande **INFORMATIONS**')
                .addFields({ name: ':x:</bot-info:>', value: 'En savoir un peu plus sur le bot & serveur,'})
                .addFields({ name: '✅</compteur-membre:1108722868197535812>', value: "Obtenir le nombre de membres du serveur,"})
                .addFields({ name: '✅</désactiver-logs:1108722868197535813>', value: 'Désactive les logs du serveur'})
                .addFields({ name: '✅</définir-logs:1108722868197535814>', value: 'Définis un salon pour les logs du serveur'})
                .addFields({ name: '✅</statistiques définir:1108722868449202328>, ✅</statistiques désactiver:1108722868449202328>', value: 'Configure le système de statistique du serveur'})
        
                await interaction.update({ embeds: [helpinfo] });
            }
 
            if (value === 'helpmod') {

              const helpmod = new EmbedBuilder()
              .setColor('#af00fe')
              .setTitle('Voici ma liste de commande **MODÉRATION**')
              .addFields({ name: '✅</anti-lien:1108722868449202332>', value: 'Empêcher les membres sur le serveur Discord d’envoyer des liens,'})
              .addFields({ name: '✅</automod spam-mentions:1108722868449202333>, ✅</automod message-spammer:1108722868449202333>, ✅</automod mot-clé:1108722868449202333>, ✅</automod mots-marqués:1108722868449202333>', value: "Configuration du système d'automodération,"})
              .addFields({ name: '✅</avertir membre:1108722868449202334>, ✅</avertir supprimer:1108722868449202334>,✅</avertir montrer:1108722868449202334>', value: 'Avertir un membre,'})
              .addFields({ name: '✅</ban-temporaire:1108722868449202335>', value: 'Bannit l’utilisateur spécifié temporairement,'})
              .addFields({ name: '✅</ban:1108722868449202336>', value: 'Bannir un membre,'})
              .addFields({ name: '✅</deban:1108722868449202337>', value: "Révoquer le bannissement d'un utilisateur,"})
              .addFields({ name: '✅</effacer-message:1108722868675686510>', value: 'Supprimer des messages en masse,'})
              .addFields({ name: '✅</expulser:1108722868675686511>', value: 'Exclure un membre,'})
              .addFields({ name: '✅</informations-membre gérer:1108722868675686512>, ✅</informations-membre éditer:1108722868675686512>, ✅</informations-membre désactiver:1108722868675686512>', value: 'Configurer le système d’adhésion des membres,'})
              .addFields({ name: '✅</liste-moderation:1108722868675686513>', value: 'Vérifier l’état actuel des commandes de modération,'})
              .addFields({ name: '✅</moderation-serveur:1108722868675686514>', value: 'Active ou désactive la modération de ton serveur,'})
              .addFields({ name: '✅</mute:1108722868675686515>', value: 'Réduire au silence un membre,'})
              .addFields({ name: '✅</who-is:1108722868675686516>', value: 'Obtenir les informations d’un utilisateur au sein de votre guilde.'})
              
                await interaction.update({ embeds: [helpmod] });
            }
 
            if (value === 'helppublic') {
 
                const helppublic = new EmbedBuilder()
                .setColor('#af00fe')
                .setTitle('Voici ma liste de commande **PUBLIC**')
                .addFields({ name: '✅</aide:1108722869153828874>', value: "Je te montre ma liste de commandes,"})
                .addFields({ name: '✅</ping:1108722869153828879>', value: "Regarde le ping du bot,"})
                .addFields({ name: '✅</signalement-bug:1108722869153828880>', value: "Fait un report d'un bug suite a une commande ou un événement"})
        
                    await interaction.update({ embeds: [helppublic] });
                  }
 
                    await interaction.update({ embeds: [helpacceuil], components: [helprow2] });
                })
            }
        })

client.on(Events.InteractionCreate, async interaction => {
 
  if (interaction.guild === null) return;

  const verifydata = await capschema.findOne({ Guild: interaction.guild.id });
  const verifyusersdata = await verifyusers.findOne({ Guild: interaction.guild.id, User: interaction.user.id });

  if (interaction.customId === 'verify') {

      if (!verifydata) return await interaction.reply({ content: `The **verification system** has been disabled in this server!`, ephemeral: true});

      if (verifydata.Verified.includes(interaction.user.id)) return await interaction.reply({ content: 'You have **already** been verified!', ephemeral: true})
      else {

          let letter = ['0','1','2','3','4','5','6','7','8','9','a','A','b','B','c','C','d','D','e','E','f','F','g','G','h','H','i','I','j','J','f','F','l','L','m','M','n','N','o','O','p','P','q','Q','r','R','s','S','t','T','u','U','v','V','w','W','x','X','y','Y','z','Z',]
          let result = Math.floor(Math.random() * letter.length);
          let result2 = Math.floor(Math.random() * letter.length);
          let result3 = Math.floor(Math.random() * letter.length);
          let result4 = Math.floor(Math.random() * letter.length);
          let result5 = Math.floor(Math.random() * letter.length);

          const cap = letter[result] + letter[result2] + letter[result3] + letter[result4] + letter[result5];
          console.log(cap)

          const captcha = new CaptchaGenerator()
          .setDimension(150, 450)
          .setCaptcha({ text: `${cap}`, size: 60, color: "red"})
          .setDecoy({ opacity: 0.5 })
          .setTrace({ color: "red" })

          const buffer = captcha.generateSync();

          const verifyattachment = new AttachmentBuilder(buffer, { name: `captcha.png`});

          const verifyembed = new EmbedBuilder()
          .setColor('Green')
          .setAuthor({ name: `✅ Verification Proccess`})
          .setFooter({ text: `✅ Verification Captcha`})
          .setTimestamp()
          .setImage('attachment://captcha.png')
          .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081199958704791552/largegreen.png')
          .setTitle('> Verification Step: Captcha')
          .addFields({ name: `• Verify`, value: '> Please use the button bellow to \n> submit your captcha!'})

          const verifybutton = new ActionRowBuilder()
          .addComponents(
              new ButtonBuilder()
              .setLabel('✅ Enter Captcha')
              .setStyle(ButtonStyle.Success)
              .setCustomId('captchaenter')
          )

          const vermodal = new ModalBuilder()
          .setTitle('Verification')
          .setCustomId('vermodal')

          const answer = new TextInputBuilder()
          .setCustomId('answer')
          .setRequired(true)
          .setLabel('• Please sumbit your Captcha code')
          .setPlaceholder('Your captcha code')
          .setStyle(TextInputStyle.Short)

          const vermodalrow = new ActionRowBuilder().addComponents(answer);
          vermodal.addComponents(vermodalrow);

          const vermsg = await interaction.reply({ embeds: [verifyembed], components: [verifybutton], ephemeral: true, files: [verifyattachment] });

          const vercollector = vermsg.createMessageComponentCollector();

          vercollector.on('collect', async i => {

              if (i.customId === 'captchaenter') {
                  i.showModal(vermodal);
              }

          })

          if (verifyusersdata) {

              await verifyusers.deleteMany({
                  Guild: interaction.guild.id,
                  User: interaction.user.id
              })

              await verifyusers.create ({
                  Guild: interaction.guild.id,
                  User: interaction.user.id,
                  Key: cap
              })

          } else {

              await verifyusers.create ({
                  Guild: interaction.guild.id,
                  User: interaction.user.id,
                  Key: cap
              })

          }
      } 
  }
})

client.on(Events.InteractionCreate, async interaction => {

  if (!interaction.isModalSubmit()) return;

  if (interaction.customId === 'vermodal') {

      const userverdata = await verifyusers.findOne({ Guild: interaction.guild.id, User: interaction.user.id });
      const verificationdata = await capschema.findOne({ Guild: interaction.guild.id });

      if (verificationdata.Verified.includes(interaction.user.id)) return await interaction.reply({ content: `You have **already** verified within this server!`, ephemeral: true});

      const modalanswer = interaction.fields.getTextInputValue('answer');
      if (modalanswer === userverdata.Key) {

          const verrole = await interaction.guild.roles.cache.get(verificationdata.Role);

          try {
              await interaction.member.roles.add(verrole);
          } catch (err) {
              return await interaction.reply({ content: `There was an **issue** giving you the **<@&${verificationdata.Role}>** role, try again later!`, ephemeral: true})
          }

          await interaction.reply({ content: 'You have been **verified!**', ephemeral: true});
          await capschema.updateOne({ Guild: interaction.guild.id }, { $push: { Verified: interaction.user.id }});

      } else {
          await interaction.reply({ content: `**Oops!** It looks like you **didn't** enter the valid **captcha code**!`, ephemeral: true})
      }
  }
})

setInterval(async () => {
 
  const bans = await banschema.find();
  if(!bans) return;
  else {
      bans.forEach(async ban => {

          if (ban.Time > Date.now()) return;

          let server = await client.guilds.cache.get(ban.Guild);
          if (!server) {
              console.log('no server')
              return await banschema.deleteMany({
                  Guild: server.id
              });

          }

          await server.bans.fetch().then(async bans => {

              if (bans.size === 0) {
                  console.log('bans were 0')

                  return await banschema.deleteMany({
                      Guild: server.id
                  });



              } else {

                  let user = client.users.cache.get(ban.User)
                  if (!user) {
                      console.log('no user found')
                      return await banschema.deleteMany({
                          User: ban.User,
                          Guild: server.id
                      });
                  }

                  await server.bans.remove(ban.User).catch(err => {
                      console.log('couldnt unban')
                      return;
                  })

                  await banschema.deleteMany({
                      User: ban.User,
                      Guild: server.id
                  });

              }
          })
      })
  }

}, 30000);

client.on("error", (err) => {
  const ChannelID = "1107629114044723274";
  console.log("Discord API Error:", err);
  const Embed = new EmbedBuilder()
    .setColor("#af00fe")
    .setTimestamp()
    .setFooter({ text: "⚠️ Anti Crash system" })
    .setTitle("Error Encounte#af00fe");
  const Channel = client.channels.cache.get(ChannelID);
  if (!Channel) return;
  Channel.send({
    embeds: [
      Embed.setDescription(
        "**Discord API Error/Catch:\n\n** ```" + err + "```"
      ),
    ],
  });
});

process.on("unhandledRejection", (reason, p) => {
  const ChannelID = "1107629114044723274";
  console.log("Unhandled promise rejection:", reason, p);
  const Embed = new EmbedBuilder()
    .setColor("#af00fe")
    .setTimestamp()
    .setFooter({ text: "⚠️ Anti Crash system" })
    .setTitle("Error Encounte#af00fe");
  const Channel = client.channels.cache.get(ChannelID);
  if (!Channel) return;
  Channel.send({
    embeds: [
      Embed.setDescription(
        "**Unhandled Rejection/Catch:\n\n** ```" + reason + "```"
      ),
    ],
  });
});

process.on("uncaughtException", (err, origin) => {
  const ChannelID = "1107629114044723274";
  console.log("Uncaught Exception:", err, origin);
  const Embed = new EmbedBuilder()
    .setColor("#af00fe")
    .setTimestamp()
    .setFooter({ text: "⚠️ Anti Crash system" })
    .setTitle("Error Encounte#af00fe");
  const Channel = client.channels.cache.get(ChannelID);
  if (!Channel) return;
  Channel.send({
    embeds: [
      Embed.setDescription(
        "**Uncought Exception/Catch:\n\n** ```" + err + "```"
      ),
    ],
  });
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  const ChannelID = "1107629114044723274";
  console.log("Uncaught Exception Monitor:", err, origin);
  const Embed = new EmbedBuilder()
    .setColor("#af00fe")
    .setTimestamp()
    .setFooter({ text: "⚠️ Anti Crash system" })
    .setTitle("Error Encounte#af00fe");
  const Channel = client.channels.cache.get(ChannelID);
  if (!Channel) return;
  Channel.send({
    embeds: [
      Embed.setDescription(
        "**Uncaught Exception Monitor/Catch:\n\n** ```" + err + "```"
      ),
    ],
  });
});

process.on("warning", (warn) => {
  const ChannelID = "1107629114044723274";
  console.log("Warning:", warn);
  const Embed = new EmbedBuilder()
    .setColor("#af00fe")
    .setTimestamp()
    .setFooter({ text: "⚠️ Anti Crash system" })
    .setTitle("Error Encounte#af00fe");
  const Channel = client.channels.cache.get(ChannelID);
  if (!Channel) return;
  Channel.send({
    embeds: [
      Embed.setDescription(
        "**Warning/Catch:\n\n** ```" + warn + "```"
      ),
    ],
  });
});

client.on(Events.GuildMemberAdd, async (member) => {

  const Data = await memberJoin.findOne({ Guild: member.guild.id});

  if (!member.user.bot) {

    const currentTime = new Date();
    const accountAgeInDays = (currentTime - member.user.createdAt) / (1000 * 60 * 60 * 24);
    let riskScale = 10 - Math.floor(accountAgeInDays / 30);
    if (riskScale < 1) riskScale = 1;

    let riskEmoji = "";
    if (riskScale >= 10) riskEmoji = "😡";
    else if (riskScale >= 9) riskEmoji = "😠";
    else if (riskScale >= 8) riskEmoji = "😤";
    else if (riskScale >= 7) riskEmoji = "😒";
    else if (riskScale >= 6) riskEmoji = "🙁";
    else if (riskScale >= 5) riskEmoji = "😕";
    else if (riskScale >= 4) riskEmoji = "🙂";
    else if (riskScale >= 3) riskEmoji = "😊";
    else if (riskScale >= 2) riskEmoji = "😄";
    else riskEmoji = "😁";

      const embed = new EmbedBuilder()
      .setColor("Green")
      .setAuthor({
          name: member.user.username,
          iconURL: member.user.avatarURL({ dynamic: true, size: 1024 }),
        })
      .setThumbnail(member.user.avatarURL())
      .setDescription(`**Member Joined | ${member}**`)
      .addFields({name:"Joined Discord",value:`<t:${parseInt(member.user.createdAt/1000)}:f>\n (<t:${parseInt(member.user.createdAt/1000)}:R>)`,inline:true})
      .addFields({name:"Risk Scale",value:`${riskScale}/10 ${riskEmoji}`,inline:true})
      .setFooter({ text: `ID: ${member.id}`})
      .setTimestamp()

      const banEmbed = new EmbedBuilder()
      .setColor("Red")
      .setAuthor({
          name: member.user.username,
          iconURL: member.user.avatarURL({ dynamic: true, size: 1024 }),
        })
      .setThumbnail(member.user.avatarURL())
      .setDescription(`The reason for banning ${member}`)
      .setFooter({ text: `ID: ${member.id}`})
      .setTimestamp()

      const warnEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setAuthor({
          name: member.user.username,
          iconURL: member.user.avatarURL({ dynamic: true, size: 1024 }),
        })
      .setThumbnail(member.user.avatarURL())
      .setDescription(`The reason for warning ${member}`)
      .setFooter({ text: `ID: ${member.id}`})
      .setTimestamp()

      const kickEmbed = new EmbedBuilder()
      .setColor('Grey')
      .setAuthor({
          name: member.user.username,
          iconURL: member.user.avatarURL({ dynamic: true, size: 1024 }),
        })
      .setThumbnail(member.user.avatarURL())
      .setDescription(`The reason for kicking ${member}`)
      .setFooter({ text: `ID: ${member.id}`})
      .setTimestamp()

      if (Data) {

        const channel1 = client.channels.cache.get(Data.Channel);

          const kickRow = new ActionRowBuilder()
            .addComponents(
              new StringSelectMenuBuilder()
                .setCustomId('kickselect')
                .setMaxValues(1)
                .setPlaceholder('Reason for kick')
                .addOptions(
                  {
                    label: 'Young Account Age',
                    value: 'Account too new to join. This ensures safety, prevents alt accounts and reduces suspicious activity.',
                  },
                  {
                    label: 'Suspicious Account Usage',
                    value: 'Your account has been kicked for suspicious usage. This ensures community safety and security.',
                  },
                  {
                    label: 'Inappropriate Username',
                    value: 'You have been kicked due to a violation of our username policy. This is to ensure community safety.',
                  },
                  {
                    label: 'Inappropriate Content',
                    value: 'Your account has been kicked due to a violation of our NSFW policy. This ensures community safety.',
                  },
                ),
            );

            const warnRow = new ActionRowBuilder()
            .addComponents(
              new StringSelectMenuBuilder()
                .setCustomId('warnselect')
                .setMaxValues(1)
                .setPlaceholder('Reason for warn')
                .addOptions(
                  {
                    label: 'Suspicious Account Usage',
                    value: 'Your account has been warned due to suspicious usage. This ensures community safety and security.',
                  },
                  {
                    label: 'Inappropriate Username',
                    value: 'You have been warned due to a violation of our username policy. This is to ensure community safety.',
                  },
                  {
                    label: 'Inappropriate Content',
                    value: 'Your account has been warned due to a violation of our NSFW policy. This ensures community safety.',
                  },
                ),
            );

            const banRow = new ActionRowBuilder()
            .addComponents(
              new StringSelectMenuBuilder()
                .setCustomId('banselect')
                .setMaxValues(1)
                .setPlaceholder('Reason for ban')
                .addOptions(
                  {
                    label: 'Young Account Age',
                    value: 'Account too new to join. This ensures safety, prevents alt accounts and reduces suspicious activity.',
                  },
                  {
                    label: 'Suspicious Account Usage',
                    value: 'Your account has been banned due to suspicious usage. This ensures community safety and security.',
                  },
                  {
                    label: 'Inappropriate Username',
                    value: 'You have been banned due to a violation of our username policy. This is to ensure community safety.',
                  },
                  {
                    label: 'Inappropriate Content',
                    value: 'Your account has been banned due to a violation of our NSFW policy. This ensures community safety.',
                  },
                ),
            );

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`kick`)
            .setLabel(`🗑️ Kick`)
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId(`warn`)
            .setLabel(`🚨 Warn`)
            .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
            .setCustomId(`ban`)
            .setLabel(`🛠️ Ban`)
            .setStyle(ButtonStyle.Danger),
        )

        const message = await channel1.send({ embeds: [embed], components: [button] });
        const collector = await message.createMessageComponentCollector();

        collector.on('collect', async i => {
            
            if (i.customId === 'kick') {

              const newMessage = await i.reply({ embeds: [kickEmbed], components: [kickRow] });
              const collector2 = newMessage.createMessageComponentCollector();

               collector2.on('collect',  async interaction => {
      
                let choices;
            
                if (interaction.customId === 'kickselect') {

                  if (!member) return interaction.reply({ content: "This member is not in the server.", ephemeral: true });
                  if (interaction.member === member) return interaction.reply({ content: "You cannot kick yourself.", ephemeral: true });
                  if (!member.kickable) return interaction.reply({ content: "You cannot kick this person.", ephemeral: true });
                  
                  choices = interaction.values;

                  const memberKickEmbed = new EmbedBuilder()
                  .setColor('Grey')
                  .setTitle(`Member Kicked | ${member.user.tag}`)
                  .addFields(
                      { name: 'User', value: `${member}`, inline: true },
                      { name: 'Moderator', value: `${interaction.member}`, inline: true },
                      { name: 'Reason', value: `${choices}`, inline: false },
                  )
                  .setFooter({ text: `ID: ${member.id}`})
                  .setTimestamp()

                  const embed = new EmbedBuilder()
                  .setColor("Blue")
                  .setDescription(`:white_check_mark:  ${member} has been **kicked** | ${choices}`)

                  const dmEmbed = new EmbedBuilder()
                  .setColor("Grey")
                  .setDescription(`:white_check_mark:  You were **kicked** from **${interaction.guild.name}** | ${choices}`)
              
                    await channel1.send({ embeds: [memberKickEmbed]})
              
                  interaction.reply({ embeds: [embed] });

                  await member.send({ embeds: [dmEmbed] }).catch(err => {
                    return ({ content: `${member} does not have their DMs open and can there for not recieve the kick DM.`, ephemeral: true })
                })

                   member.kick({ reason: choices.join(' ') }).catch(err => {
                    return ({ content: `${member} could not be kicked.`, ephemeral: true })
                })
                collector2.stop();
                }
      
               })

            }
            if (i.customId === 'warn') {

              const newMessage = await i.reply({ embeds: [warnEmbed], components: [warnRow] });
              const collector2 = newMessage.createMessageComponentCollector();

               collector2.on('collect',  async interaction => {
      
                let choices;
            
                if (interaction.customId === 'warnselect') {

                  if (!member) return interaction.reply({ content: "This member is not in the server.", ephemeral: true });
                  if (interaction.member === member) return interaction.reply({ content: "You cannot warn yourself.", ephemeral: true });
                  if (!member.kickable) return interaction.reply({ content: "You cannot warn this person.", ephemeral: true });
                  
                  choices = interaction.values;

                  const memberWarnEmbed = new EmbedBuilder()
                  .setColor('Blue')
                  .setTitle(`Member Warned | ${member.user.tag}`)
                  .addFields(
                      { name: 'User', value: `${member}`, inline: true },
                      { name: 'Moderator', value: `${interaction.member}`, inline: true },
                      { name: 'Reason', value: `${choices}`, inline: false },
                  )
                  .setFooter({ text: `ID: ${member.id}`})
                  .setTimestamp()

                  const embed = new EmbedBuilder()
                  .setColor("Blue")
                  .setDescription(`:white_check_mark:  ${member} has been **warned** | ${choices}`)

                  const dmEmbed = new EmbedBuilder()
                  .setColor("Blue")
                  .setDescription(`:white_check_mark:  You were **warned** from **${interaction.guild.name}** | ${choices}`)
              
                    await channel1.send({ embeds: [memberWarnEmbed]})
              
                  interaction.reply({ embeds: [embed] });

                  await member.send({ embeds: [dmEmbed] }).catch(err => {
                    return ({ content: `${member} does not have their DMs open and can there for not recieve the warn DM.`, ephemeral: true })
                })
                collector2.stop();
                }
      
               })

          }
          if (i.customId === 'ban') {

            const newMessage = await i.reply({ embeds: [banEmbed], components: [banRow] });
            const collector2 = newMessage.createMessageComponentCollector();

             collector2.on('collect',  async interaction => {
    
              let choices;
          
              if (interaction.customId === 'banselect') {

                if (!member) return interaction.reply({ content: "This member is not in the server.", ephemeral: true });
                if (interaction.member === member) return interaction.reply({ content: "You cannot ban yourself.", ephemeral: true });
                if (!member.kickable) return interaction.reply({ content: "You cannot ban this person.", ephemeral: true });
                
                choices = interaction.values;

                const memberBanEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle(`Member Banned | ${member.user.tag}`)
                .addFields(
                    { name: 'User', value: `${member}`, inline: true },
                    { name: 'Moderator', value: `${interaction.member}`, inline: true },
                    { name: 'Reason', value: `${choices}`, inline: false },
                )
                .setFooter({ text: `ID: ${member.id}`})
                .setTimestamp()

                const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`:white_check_mark:  ${member} has been **banned** | ${choices}`)

                const dmEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`:white_check_mark:  You were **banned** from **${interaction.guild.name}** | ${choices}`)

                  await channel1.send({ embeds: [memberBanEmbed]})
            
                interaction.reply({ embeds: [embed] });

                await member.send({ embeds: [dmEmbed] }).catch(err => {
                  return ({ content: `${member} does not have their DMs open and can there for not recieve the ban DM.`, ephemeral: true })
              })

              member.ban({ reason: choices.join(' ') }).catch(err => {
                  return ({ content: `${member} could not be banned.`, ephemeral: true }) 
              })

              collector2.stop();
              }
    
             })

        }
          }
        )
        
    }
  }
})

client.on(Events.GuildCreate, async guild => {
  const data = await blacklistserver.findOne({ Guild: guild.id });

  if (!data) return;
  else {
    await guild.leave()
  }
})

client.on(Events.MessageReactionAdd, async (reaction, member) => {

  try {
      await reaction.fetch();
  } catch (error) {
      return;
  }

  if (!reaction.message.guild) return;
  else {

      const reactionroledata = await reactschema.find({ MessageID: reaction.message.id });

      await Promise.all(reactionroledata.map(async data => {
          if (reaction.emoji.id !== data.Emoji) return;
          else {

              const role = await reaction.message.guild.roles.cache.get(data.Roles);
              const addmember = await reaction.message.guild.members.fetch(member.id);

              if (!role) return;
              else {

                  try {
                      await addmember.roles.add(role)
                  } catch (err) {
                      return console.log(err);
                  }

                  try {

                      const addembed = new EmbedBuilder()
                      .setColor('DarkRed')
                      .setAuthor({ name: `💳 Reaction Role Tool`})
                      .setFooter({ text: `💳 Role Added`})
                      .setTitle('> You have been given a role!')
                      .setTimestamp()
                      .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
                      .addFields({ name: `• Role`, value: `> ${role.name}`, inline: true}, { name: `• Emoji`, value: `> ${reaction.emoji}`, inline: true}, { name: `• Server`, value: `> ${reaction.message.guild.name}`, inline: false})
                      addmember.send({ embeds: [addembed] })
  
                  } catch (err) {
                      return;
                  }
              }
          }
      }))
  }
})

client.on(Events.MessageReactionRemove, async (reaction, member) => {

  try {
      await reaction.fetch();
  } catch (error) {
      return;
  }

  if (!reaction.message.guild) return;
  else {

      const reactionroledata = await reactschema.find({ MessageID: reaction.message.id });

      await Promise.all(reactionroledata.map(async data => {
          if (reaction.emoji.id !== data.Emoji) return;
          else {

              const role = await reaction.message.guild.roles.cache.get(data.Roles);
              const addmember = await reaction.message.guild.members.fetch(member.id);

              if (!role) return;
              else {

                  try {
                      await addmember.roles.remove(role)
                  } catch (err) {
                      return console.log(err);
                  }

                  try {

                      const removeembed = new EmbedBuilder()
                      .setColor('DarkRed')
                      .setAuthor({ name: `💳 Reaction Role Tool`})
                      .setFooter({ text: `💳 Role Removed`})
                      .setTitle('> You have removed from a role!')
                      .setTimestamp()
                      .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
                      .addFields({ name: `• Role`, value: `> ${role.name}`, inline: true}, { name: `• Emoji`, value: `> ${reaction.emoji}`, inline: true}, { name: `• Server`, value: `> ${reaction.message.guild.name}`, inline: false})
                      addmember.send({ embeds: [removeembed] })
  
                  } catch (err) {
                      return;
                  }
              }
          }
      }))
  }
})