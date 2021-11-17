const { Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { glob } = require('glob');

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

const commands = new Collection();
function loadCommands() {
    return new Promise((resolve) => {
        glob('./commands/**/*.js', (err, files) => {
            if (err) throw err;
            files.forEach((file) => {
                const command = require(file);
                const fileDir = file.split('/');
                // If file is in command directory it is not a subcommand
                if (fileDir[2].endsWith('.js')) {
                    commands.set(command.name, command);
                    console.log(`\x1b[32mAdded command\x1b[0m [\x1b[36m${command.name}\x1b[0m]`);
                } else {
                    const masterCommand = commands.has(fileDir[2]) ? commands.get(fileDir[2]) : { options: [] };
                    // Set master file
                    if (fileDir[2] === command.name) {
                        command.options = masterCommand.options;
                        commands.set(command.name, command);
                        console.log(`\x1b[32mAdded master command\x1b[0m [\x1b[36m${command.name}\x1b[0m]`);
                        return;
                    }
                    if (!(fileDir[2].endsWith('.js')) && !(fileDir[3].endsWith('.js'))) {
                        // TODO OMG
                    } else {
                        delete command.execute;
                        command.type = 1
                        console.log(`\x1b[32mAdded subcommand\x1b[0m [\x1b[36m${command.name}\x1b[0m]`);
                    }
                    masterCommand.options.push(command);
                    commands.set(fileDir[2], masterCommand);
                }
            });
            resolve();
        });
    })
}

(async () => {
    await loadCommands();
    try {
        console.log('Started refreshing application (/) commands.');
        if (process.env.dev) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                {
                    body: commands.map(({ execute, ...data }) => data)
                },
            );
        } else {
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                {
                    body: commands.map(({ execute, ...data }) => data)
                },
            );
        }
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
