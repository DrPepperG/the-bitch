module.exports = {
    name: 'imposter',
    description: 'Guess who the imposter is!',
    options: [{
        name: 'imposter',
        type: 9,
        description: 'The user you think is the imposter.',
        required: false,
    }],
    async execute(interaction) {
        const imposterGame = interaction.client.games.get('imposter');

        if (imposterGame.data.caught) {
            return imposterGame.reply({
                msg: interaction,
                user: interaction.user,
                title: '📮 Guess the imposter',
                fields: [
                    {
                        name: 'The imposter has been caught!',
                        value: 'Try again tomorrow to find the imposter and win the epic detective role!',
                        inline: false
                    }
                ]
            })
        }

        if (!interaction.options.get('imposter')) {
            imposterGame.reply({
                msg: interaction,
                user: interaction.user,
                title: '📮 Guess the imposter',
                fields: [
                    {
                        name: 'Here is the hint of the day!',
                        value: imposterGame.data.clue,
                        inline: false
                    }
                ]
            })
        } else {
            const throttle = imposterGame.throttle(interaction.user.id);
            if (throttle && throttle.usages + 1 > imposterGame.throttling.usages) {
                const remaining = (throttle.start + (imposterGame.throttling.duration * 1000) - Date.now()) / 1000
                return interaction.reply(`You may not play the \`${imposterGame.name}\` game again for another ${remaining.toFixed(1)} seconds.`);
            }
            // Execute game
            imposterGame.execute(interaction);
            // Add to throttle
            if (throttle) throttle.usages++;
        }
    },
};
