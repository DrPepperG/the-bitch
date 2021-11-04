const Game = require('./classes/base.js')
const { games, response_reaction } = require('../config.json');
var { evaluate } = require('mathjs')

module.exports = class CountingGame extends Game {
    constructor(client) {
        super(client, {
            name: 'counting',
            channel: {
                id: games.counting.channel,
                exclusive: true,
            },
        })
    }

    execute(msg, args) {
        // Check if bot
        if (msg.author.bot) return;
        // Check if the last message was sent by the user
        if ((msg.author.id === this.data.last) && (this.data.count !== 0)) return this.fail(msg, 'You can not count two numbers in a row');
        // Run our content through a math eval
        try {
            // Attempt to eval the math
            var num = evaluate(msg.content)
        }
        catch (e) {
            // If it errors then we know it isn't a number
            return this.fail(msg, 'You must give a number!');
        }
        // Check if the number increments correctly
        if (num !== (this.data.count + 1)) return this.fail(msg, 'Wrong number')
        // React with gilby :)
        msg.react(response_reaction);
        // Add to the count
        this.data.last = msg.author.id;
        this.data.count++;
        // Write to our json file
        this.save(this.data);
    }

    /**
     * If the count fails this will run
     * @param {*} msg 
     */
    fail(msg, reason) {
        msg.react('😡');
        msg.channel.send(`<@${msg.author.id}> ruined the count 😔, it got to **${this.data.count}**!\n**Reason**: ${reason}`)
        // Reset the count
        this.data.count = 0;
        this.save(this.data);
    }
}
