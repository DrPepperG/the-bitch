const Game = require('./classes/base.js')
const { games } = require('../config.json');

module.exports = class CoinGame extends Game {
    constructor(client) {
        super(client, {
            name: 'coinflip',
            channel: {
                id: games.main.channel,
            },
            throttling: {
                usages: 5,
                duration: 10,
            },
        })
    }

    execute(msg, args) {
        msg.reply(`🪙 I have flipped a coin and it landed on **${(Math.random() <= .5) ? 'Heads' : 'Tails' }**`);
    }
}
