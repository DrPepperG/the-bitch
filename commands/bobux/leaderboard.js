const { Formatters } = require('discord.js');

module.exports = {
    name: 'leaderboard',
    description: 'Get all the people with the most bobux!',
    async execute(interaction) {
        const { currency } = interaction.client.util.get('currency');
        return interaction.reply(
            Formatters.codeBlock(
                currency.sort((a, b) => b.balance - a.balance)
                    .filter(user => interaction.client.users.cache.has(user.user_id))
                    .first(10)
                    .map((user, position) => `(${position + 1}) ${(interaction.client.users.cache.get(user.user_id).tag)}: ${user.balance} bobux`)
                    .join('\n'),
            ),
        );

    }
};
