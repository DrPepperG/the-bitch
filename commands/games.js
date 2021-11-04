module.exports = {
    name: 'games',
    description: 'Lists all the current games enabled on the bot!',
    async execute(interaction) {
        let data = [];

        interaction.client.games.forEach((v, k) => {
            if (v.internal) return;
            if (v.channel) {
                data += `**ft ${k}** <#${v.channel.id}>\n`;
            } else {
                data += '**ft '+ k +'** `global game`\n';
            }
        });

        interaction.reply({
            embeds: [
                {
                    color: 16711680,
                    author: {
                        name: interaction.user.username,
                        icon_url: interaction.user.avatarURL()
                    },
                    title: '🎲 Game list',
                    fields: [
                        {
                            name: '*Games can only be played in specified channel*',
                            value: data.toString(),
                            inline: false
                        },
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: interaction.guild.name,
                        iconURL: interaction.guild.iconURL()
                    }
                }
            ]
        })
    },
};
