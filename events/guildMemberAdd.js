module.exports = {
    name: 'guildMemberAdd',
    execute(member) {
        if (!member) { return; }
        // Find our welcome channel
        const channel = member.guild.channels.cache.find(ch => ch.name === '👋welcome-channel');
        if (channel) {
            channel.send(`<@${member.id}> has joined **${member.guild.name}**!`);
        };
    }
}
