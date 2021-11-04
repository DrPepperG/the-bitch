const { ranks } = require('../config.json')

module.exports = {
    name: 'guildMemberUpdate',
    execute(oldM, newM) {
        // Give member role if user accepts screening
        if (oldM.pending && !newM.pending) {
            newM.roles.add(ranks.member);
        }
    }
};
