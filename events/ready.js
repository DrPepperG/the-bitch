module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`\x1b[32mLogged in as \x1b[33m${client.user.username}#${client.user.discriminator}\x1b[0m`);
        console.log(`\x1b[32mCurrently in \x1b[33m${client.guilds.cache.size}\x1b[32m guild(s)\x1b[0m`);
        // Run any ready utilities
        client.util.filter((util) => util.event === 'client')
            .each(util => util.execute(client))
        // Find our exclusive games
        client._exclusiveGames = []
        client.games.forEach((e) => {
            if (e.channel && e.channel.exclusive) {
                client._exclusiveGames[e.channel.id] = e;
            }
        })
    },
}
