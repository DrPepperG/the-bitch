module.exports = {
    name: 'transfer',
    description: 'Give a user some epic bobux :).',
    options: [{
        name: 'user',
        type: 6,
        description: 'Mention the user you would like to give bobux.',
        required: true,
    }, 
    {
        name: 'amount',
        type: 4,
        description: 'Amount of bobux to give.',
        required: true,
    }],
    async execute(interaction) {
        const { currency } = interaction.client.util.get('currency');
        const currentAmount = currency.getBalance(interaction.user.id);
        const transferAmount = interaction.options.getInteger('amount');
        const transferTarget = interaction.options.getUser('user');

        if (transferAmount > currentAmount) return interaction.reply(`Sorry ${interaction.user}, you only have ${currentAmount}.`);
        if (transferAmount <= 0) return interaction.reply(`Please enter an amount greater than zero, ${interaction.user}.`);

        currency.add(interaction.user.id, -transferAmount);
        currency.add(transferTarget.id, transferAmount);

        return interaction.reply(`Successfully transferred **${transferAmount} bobux** to **${transferTarget.tag}**. Your current balance is **${currency.getBalance(interaction.user.id)} bobux**`);
    }
};
