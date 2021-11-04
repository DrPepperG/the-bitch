const Game = require('./classes/base.js')
const { response_reaction } = require('../config.json');

module.exports = class PetGame extends Game {
    constructor(client) {
        super(client, {
            name: 'pet',
            throttling: {
                usages: 2,
                duration: 5
            },
        })
    }

    execute(msg, args) {
        this.data.count++; // Increment our pet count by 1
        this.save(this.data);
        // React to the pet
        msg.react(response_reaction);
        msg.channel.send(`Thank you for petting me, <@${msg.author.id}>. **:D** :heart:\n*Total Pets:* **${this.data.count}**.`) // Reply to the member
    }
}
