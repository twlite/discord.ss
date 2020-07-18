const Constants = require("../Constants");

class Payload {

    constructor() {
        throw new Error(`Class ${this.constructor.name} may not be instantiated!`);
    }

    /**
     * Creates identify payload
     * @param {Object} data Payload Data
     */
    static IDENTIFY(data) {
        return {
            op: Constants.OP_CODES.IDENTIFY,
            d: {
                token: data.token || null,
                properties: {
                    $os: Constants.OS,
                    $browser: Constants.BROWSER,
                    $device: Constants.DEVICE
                }
            }
        };
    }

    /**
     * Creates precence update payload
     * @param {Object} data payload data
     */
    static PRESENCE(data) {
        return {
            op: Constants.OP_CODES.PRESENCE_UPDATE,
            d: {
                game: {
                    name: data.game ? data.game.name : null,
                    type: data.game ? data.game.type : 0,
                    url: data.game ? data.game.url : null
                },
                status: data.status || "online",
                since: data.since || Date.now(),
                afk: !!data.afk
            }
        };
    }

}

module.exports = Payload;