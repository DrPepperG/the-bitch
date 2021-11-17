module.exports = {
    name: 'gradcount',
    description: "Display the current countdown for Daddy's graduation",
    execute(interaction) {
        const gradDate = new Date(1638655200000)
        const seconds = gradDate.getTime() - Date.now()
        const dhms = seconds.toDhms()

        interaction.reply({
            embeds: [{
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
            }]
        })
    }
}
