const topics = [
    'in RENO',
];

module.exports = {
    name: 'topicRandom',
    event: 'ready',
    async execute(client) {
        // Set our activity on start
        client.user.setActivity(topics[Math.floor(topics.length * Math.random())]);
        setInterval(() => {
            client.user.setActivity(topics[Math.floor(topics.length * Math.random())]);
        }, 60000);
    },
}
