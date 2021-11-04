module.exports = {
    name: 'balance',
    description: 'Check yours or another users bobux balance!',
    options: [{
        name: 'user',
        type: 6,
        description: 'Mention the user you would like to see the balance of.',
        required: false,
    }],
    async execute(interaction) {
        const { currency } = interaction.client.util.get('currency');
        const target = interaction.options.getUser('user') ?? interaction.user;
        return interaction.reply(`**${target.tag}** has **${currency.getBalance(target.id)} bobux**`);
    }
};
