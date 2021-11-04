module.exports = {
    name: 'gameDispatcher',
    event: 'messageCreate',
    execute(msg, client) {
        // Check if message has our command prefix
        if (!msg.content.toLowerCase().startsWith(client.commandPrefix) && !client._exclusiveGames[msg.channel.id]) { return; }
        const args = msg.content.trim().split(/ +/g);
        const loadedGame = client.games.get(args.splice(0, 2)[1]) || client._exclusiveGames[msg.channel.id]; // Get our game from the args

        if (!loadedGame) return;
        if (loadedGame.internal || (loadedGame.channel && (loadedGame.channel.id !== msg.channel.id))) return; // Check if its channel locked
        // Check for throttle
        const throttle = loadedGame.throttle(msg.author.id);
        if (throttle && throttle.usages + 1 > loadedGame.throttling.usages) {
            const remaining = (throttle.start + (loadedGame.throttling.duration * 1000) - Date.now()) / 1000
            return msg.reply(`You may not play the \`${loadedGame.name}\` game again for another ${remaining.toFixed(1)} seconds.`);
        }
        // Check if we have the require arg count
        if (loadedGame.args && args.length !== loadedGame.args) msg.reply(`This game is expecting ${loadedGame.args} argument(s)`)
        // Run the game
        try {
            loadedGame.execute(msg, args)
        }
        catch (e) {
            console.log(e)
        }
        finally {
            // Add usages to throttle
            if (throttle) throttle.usages++;
        }
    }
}
