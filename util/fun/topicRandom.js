const topics = [
    {
        type: 'PLAYING',
        message: 'in RENO'
    },
    {
        type: 'WATCHING',
        message: 'the sale on tropickles'
    }
];

module.exports = {
    name: 'topicRandom',
    event: 'ready',
    async execute(client) {
        // Set our activity on start
        setActivity(client);
        // Create our interval
        setInterval(setActivity, 60000, client);
    },
}

function setActivity(client) {
    const topic = topics[Math.floor(topics.length * Math.random())];

    client.user.setActivity(topic.message, {
        type: topic.type
    });
}
