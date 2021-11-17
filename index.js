console.log(`\x1b[32mStarting bot\x1b[0m`);
// Create our discord client
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
client.commandPrefix = 'ft';
client.commands = new Collection();
client.util = new Collection();
// Prototypes
require('./prototypes');
// Loader
const loader = [
    {
        name: 'command',
        collection: 'commands',
        dir: './commands/**/*.js',
    },
    {
        name: 'utility',
        collection: 'util',
        dir: './util/**/*.js',
    }
]
// Vars
const { glob } = require('glob');
const { token } = require('./config.json');
// Events
glob('./events/**/*.js', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(file);
        if (event.once) {
            client.once(event.name, (...args) => {
                // Execute event code
                event.execute(...args, client)
                // Execute utils tied to event
                client.util.filter((util) => util.event === event.name)
                    .each(util => util.execute(...args, client))
            });
        } else {
            client.on(event.name, (...args) => {
                // Execute event code
                event.execute(...args, client)
                // Execute utils tied to event
                client.util.filter((util) => util.event === event.name)
                    .each(util => util.execute(...args, client))
            });
        }
        console.log(`\x1b[32mLoaded event\x1b[0m [\x1b[36m${event.name}\x1b[0m]`);
    });
});
// Load all extra files
loader.forEach((entry) => {
    glob(entry.dir, (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            const ent = require(file);
            if (entry.class) {
                const game = new ent(client);
                client[entry.collection].set(game.name, game);
            } else {
                const fileDir = file.split('/')[2]
                if (entry.name === 'command' && !fileDir.endsWith('.js') && fileDir !== ent.name) {
                    const commandName = ent.name.capitalize();
                    ent.name = fileDir + commandName;
                }
                client[entry.collection].set(ent.name, ent);
            }
            console.log(`\x1b[32mLoaded ${entry.name}\x1b[0m [\x1b[36m${ent.name}\x1b[0m]`);
        });
    })
});

client.login(token);
