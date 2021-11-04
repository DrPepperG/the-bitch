const { deploy } = require('../../config.json')
const cron = require('node-cron');

module.exports = {
    name: 'imposterGenerator',
    event: 'ready',
    async execute(client) {
        cron.schedule('0 8 * * *', () => {
            // Generate imposter
            generateImposter(client)
        }, {
            timezone: 'America/New_York'
        })
    }
}

async function generateImposter(client) {
    const guild = await client.guilds.fetch(deploy.guildId);
    const members = await guild.members.fetch()
        .then(members => {
            return members.filter(member => !member.user.bot)
        });

    // Get detective role and remove it from each member
    // 1 person will have it, no need to slow it down for rate limits.
    const detectiveRole = guild.roles.cache.find(role => role.name === 'Detective')
    detectiveRole.members.forEach((member) => {
        member.roles.remove(detectiveRole)
    })

    // Get random member to be imposter
    const imposter = members.random();
    let data = {
        imposterId: imposter.id,
        clue: `The imposter's name starts with a(n) ${imposter.displayName.charAt(0).toUpperCase()}`,
        caught: false,
    }

    const game = client.games.get('imposter')
    // If imposter was not caught then reward them
    if (!game.data.caught) {
        const { currency } = client.util.get('currency');
        currency.add(game.data.imposterId, 150);
    }
    // Reset game
    game.guessers = {} // Clear guessers
    game.data = data
    game.save(data) // Save overwritten data to database

    // Announce the new imposter
    imposter.send({
        embeds: [{
            color: 16711680,
            author: {
                name: imposter.user.username,
                icon_url: imposter.user.avatarURL()
            },
            title: `You are today's imposter on ${guild.name}!`,
            fields: [
                {
                    name: 'What does that mean?',
                    value: `Every day our bot picks out a random user to be the **imposter**!
                    If a user figures out that you are the imposter they will receive our **detective role**!`,
                    inline: false
                },
                {
                    name: 'What do I do?',
                    value: `You can either keep quiet and hope no one goes looking for your name,
                    or you have the ability to throw people off your scent by making a fake guess against yourself.

                    Simply do **/imposter** <@${imposter.user.id}> in our discord to make a fake guess.`,
                    inline: false
                }
            ],
            timestamp: new Date(),
            footer: {
                text: guild.name,
                iconURL: guild.iconURL()
            }
        }]
    }).catch(console.log);
}
