const User = require("./User");
const Payload = require("../WebSocket/Payload");
const Presence = require("./Presence");

class ClientUser extends User {

    constructor(client, data) {
        super(client, data);
    }

    /**
     * Set user activity
     * @param {Object} data Activity data
     */
    setActivity(data) {
        return new Promise((resolve, reject) => {
            if (!data || typeof data !== "object") return resolve();
            let activity = data.activity && typeof data.activity === "object" ? data.activity : {};
            let status = data.status && ["online", "offline", "dnd", "idle", "streaming"].includes(data.status) ? data.status : "online";
            let afk = !!data.afk;
            let since = data.since && typeof data.since === "number" ? data.since : Date.now();

            let game = Presence(activity, status, afk, since);
            this._client.ws.send(Payload.PRESENCE(game));
            resolve(this);
        });
    }

    /**
     * Set user status
     * @param {String} type Status type (dnd, online, idle, offline)
     */
    setStatus(type) {
        let status = type || "online";
        return this.setActivity({ status });
    }

    /**
     * Set game
     * @param {Object} data Game object
     */
    setGame(data) {
        return this.setActivity({ game: data });
    }
}

module.exports = ClientUser;