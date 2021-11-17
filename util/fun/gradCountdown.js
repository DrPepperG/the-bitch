module.exports = {
    name: 'gradCountdown',
    event: 'ready',
    async execute(client) {
        const guild = await client.guilds.fetch(process.env.GUILD_ID)
        const channel = guild.channels.cache.find(c => c.name === 'grad-countdown')

        if (!channel) return console.warn(`\x1b[31mGrad channel not found\x1b[0m`)

        let pinned = await channel.messages.fetchPinned()
            .then(messages => messages.last())

        const gradDate = new Date(1638655200000)

        setInterval(() => {
            const seconds = gradDate.getTime() - Date.now()
            const dhms = seconds.toDhms()

            let embed = {
                color: 0x0674f9,
                title: 'Daddy Grad Countdown!',
                description: `**${dhms}** until graduation!`,
                image: {
                    url: 'https://v.idomoo.com/2690/0000/17210913921360678955369.gif',
                    height: 200,
                    width: 200,
                },
                fields: [
                    {
                        name: 'Graduation Date',
                        value: gradDate.toString(),
                    },
                ],
                timestamp: new Date(),
            }

            if (pinned) {
                pinned.edit({
                    embeds: [embed],
                })
            } else {
                channel.send({
                    embeds: [embed],
                }).then(msg => { 
                    msg.pin() 
                    pinned = msg
                })
            }

        }, 15000)
    }
}
