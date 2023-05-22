module.exports = {
    // Basic configuration
    token: 'TOKEN', // Place here your token
    status: 'v1.0',
    developerGuildID: '1082778799730593802', // Place here your Guild ID
    database: 'mongodb+srv://multipurpose:mzacVfmADTmxml7Z@cluster0.y4k1m.mongodb.net/test', // Place here your MongoDB access

    // Ticket configuration 
    ticketName: 'ticket-',
    ticketDescription: '🌿 Ticket open by',
    ticketCreate: '✅ Votre billet a été créé',
    ticketAlreadyExist: 'Désolé, mais vous avez déjà un billet ouvert.',
    ticketNoPermissions: 'Désolé, mais vous n’avez pas la permission de le faire.',
    ticketError: 'Quelque chose a mal tourné, réessayez plus tard.',
    ticketMessageTitle: 'Bienvenue à vous, merci d’avoir ouvert un billet.',
    ticketMessageDescription: 'Un membre de notre équipe de modération s’occupera bientôt de votre demande.\nMerci d’attendre dans le calme et la bonne humeur.',
    ticketClose: 'Close',
    ticketCloseEmoji: '📪',
    ticketLock: 'Lock',
    ticketLockEmoji: '🔒',
    ticketUnlock: 'Unlock',
    ticketUnlockEmoji: '🔓',
    ticketClaim: 'Claim',
    ticketClaimEmoji: '👋',
    ticketManage: 'Members',
    ticketManageEmoji: '➕',
    ticketManageMenuTitle: 'Choose a member.',
    ticketManageMenuEmoji: '❔',
    ticketCloseTitle: 'The ticket is currently being closed...',
    ticketCloseDescription: 'Ticket will be closed in 5 seconds.',
    ticketSuccessLocked: 'Ticket was locked succesfully.',
    ticketAlreadyLocked: 'This ticket is already locked.',
    ticketSuccessUnlocked: 'Ticket was unlocked succesfully.',
    ticketAlreadyUnlocked: 'This ticket is already unlocked.',
    ticketSuccessClaim: 'Ticket was successfully claimed by',
    ticketAlreadyClaim: 'Ticket is already claimed by',
    ticketDescriptionClaim: ', it was claimed by',
    ticketTranscriptMember: 'Member:',
    ticketTranscriptTicket: 'Ticket:',
    ticketTranscriptClaimed: 'Claimed:',
    ticketTranscriptModerator: 'Moderator:',
    ticketTranscriptTime: 'Time:',
    ticketMemberAdd: 'has been added to the ticket.',
    ticketMemberRemove: 'has been removed to the ticket.',
}