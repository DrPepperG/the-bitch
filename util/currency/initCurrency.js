const { Collection } = require('discord.js');

const currency = new Collection()

module.exports = {
    name: 'currency',
    event: 'client',
    currency: currency,
    async execute(client) {
        Reflect.defineProperty(currency, 'add', {
            value: async function add(id, amount) {
                // Emit currencyUpdate
                client.emit('currencyUpdate', id, amount);
                // Add currency
                const user = currency.get(id);
                if (user) {
                    user.balance += Number(amount);
                    return user.save();
                }
                const newUser = await db.Users.create({ user_id: id, balance: amount });
                currency.set(id, newUser);
                return newUser;
            },
        });

        Reflect.defineProperty(currency, 'getBalance', {
            value: function getBalance(id) {
                const user = currency.get(id);
                return user ? user.balance : 0;
            },
        });

        const storedBalances = await db.Users.findAll();
        storedBalances.forEach(b => currency.set(b.user_id, b));
    }
}
