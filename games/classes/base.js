class Game {
    constructor(client, info) {
        /**
         * The discord client
         * @name Command#client
         * @type {CommandoClient}
         * @readonly
         */
        Object.defineProperty(this, 'client', { value: client });

        /**
         * Name of the game
         * @type {string}
         */
        this.name = info.name;

        /**
         * Channel for the game
         * @type {string}
         */
        this.channel = info.channel || null;
        
        /**
         * The amount of args expected
         * @type {number}
         */
        this.args = info.args || null,

        /**
         * Options for throttling command usages
         * @type {?ThrottlingOptions}
         */
        this.throttling = info.throttling || null;

        /**
         * Current throttle objects for the command, mapped by user ID
         * @type {Map<string, Object>}
         * @private
         */
        this._throttles = new Map();

        /**
         * Wether this game can only be accessed through code
         * @type {boolean}
         */
        this.internal = info.internal || false;

        /**
         * Run our database queries
         */
        this.init();
    }
    init() {
        db.Games.findOrCreate({
            where: { name: this.name.toLowerCase() },
            defaults: { data: {} },
            raw: true
        }).then(([ item ]) => {
            this.data = JSON.parse(item.data)
        })
    }
    /**
     * Runs if there is no execute function
     * which there should be :)
     */
    async execute() {
        throw new Error(`${this.constructor.name} needs to have a execute() method added to it!`)
    }

    /**
     * Creates/obtains the throttle object for a user
     * @param {string} userID - ID of the user to throttle for
     * @return {?Object}
     * @private
     */
    throttle(userID) {
        if (!this.throttling) return null;

        let throttle = this._throttles.get(userID);
        if (!throttle) {
            throttle = {
                start: Date.now(),
                usages: 0,
                timeout: setTimeout(() => {
                    this._throttles.delete(userID);
                }, this.throttling.duration * 1000)
            };
            this._throttles.set(userID, throttle);
        }
        return throttle;
    }

    /**
     * Send reply with a cool embed
     */
    reply(obj = { msg: null, user: null, title: null, fields: []}) {
        const embed = {
            color: 16711680,
            author: {
                name: obj.user.username,
                icon_url: obj.user.avatarURL()
            },
            title: obj.title,
            fields: obj.fields,
            timestamp: new Date(),
            footer: {
                text: obj.msg.guild.name,
                iconURL: obj.msg.guild.iconURL()
            }
        }
        obj.msg.reply({
            embeds: [embed]
        })
    }

    /**
     * Saves the data of the game to a json file
     * @param {string} data 
     */
    async save(data) {
        if (!data) return
        db.Games.upsert({ name: this.name.toLowerCase(), data: data })
            .catch(console.error)
    }
}

module.exports = Game;
