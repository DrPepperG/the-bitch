const Game = require('./classes/base.js')
const { games } = require('../config.json');

module.exports = class ImposterGame extends Game {
    constructor(client) {
        super(client, {
            name: 'imposter',
            channel: {
                id: games.main.channel,
            },
            throttling: {
                usages: 1,
                duration: 60,
            },
            internal: true,
        })
        /**
         * Max guesses for the day
         * @type {string}
         */
        this.maxGuesses = 3
        /**
         * Array of users that have guessed this round
         * @type {object}
         */
        this.guessers = {}
    }

    execute(interaction) {
        if (this.data.caught) return;

        // Grab or create guesser object
        const guesses = this.guessers[interaction.user.id]
            ? this.guessers[interaction.user.id]
            : this.guessers[interaction.user.id] = { count: 0 }
        // If the user has reached the max guesses then return
        if (guesses.count >= this.maxGuesses)
            return this.reply({
                msg: interaction,
                user: interaction.user,
                title: '📮 Guess the imposter',
                fields: [
                    {
                        name: 'You have ran out of guesses!',
                        value: `You have used up all your **guesses** for **today**!
                            Try again **tomorrow** for a chance to win **100** bobux!`,
                        inline: false
                    }
                ]
            })

        const guessedUser = interaction.options.get('imposter')
        // Imposter check logic
        if (!(interaction.user.id === this.data.imposterId) && (guessedUser.user.id === this.data.imposterId)) {
            // Set to caught
            this.data.caught = true;
            this.save(this.data);

            // Get and give the detective role
            const detectiveRole = interaction.guild.roles.cache.find(role => role.name === 'Detective')
            interaction.member.roles.add(detectiveRole)

            // Give bobux
            const { currency } = interaction.client.util.get('currency');
            currency.add(interaction.user.id, 100);

            // Reply
            this.reply({
                msg: interaction,
                user: interaction.user,
                title: '📮 Guess the imposter',
                fields: [
                    {
                        name: 'You caught the imposter!',
                        value: `**${guessedUser.user.tag}** was the **imposter**!
                        For your **epic** detective skills we've given you our **exclusive** <@&${detectiveRole.id}> role for the day and **100 bobux**!`,
                        inline: false
                    }
                ]
            })
        } else {
            this.reply({
                msg: interaction,
                user: interaction.user,
                title: '📮 Guess the imposter',
                fields: [
                    {
                        name: "That's not the imposter!",
                        value: `**${guessedUser.user.tag}** is not the imposter!
                        You can guess again in **${this.throttling.duration / 60}** minutes.`,
                        inline: false
                    }
                ]
            })
        }

        // Add to user's current guesses
        guesses.count++;
    }
}
