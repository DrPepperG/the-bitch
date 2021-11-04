module.exports = {
    name: 'commandDispatcher',
    event: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;
        if (!client.commands.has(interaction.commandName)) return;

        try {
            if (interaction.options.getSubcommand(false)) {
                const commandName = interaction.commandName + interaction.options.getSubcommand().capitalize()
                await client.commands.get(commandName).execute(interaction);
            } else {
                await client.commands.get(interaction.commandName).execute(interaction);
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};
