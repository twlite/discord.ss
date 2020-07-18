const { EventEmitter } = require("events");
const WebSocket = require("./WebSocket/Websocket.js");
const ClientUser = require("./Structures/ClientUser.js");
const Collection = require("./Structures/Collection");
const Constants = require("./Constants");
const FormData = require("form-data");
const Rest = require("./Rest/RestManager");
const Message = require("./Structures/Message.js");

class Client extends EventEmitter {

    /**
     * Creates new discord client
     * @param {String} token token of the client
     */
    constructor(token) {
        if (!token) throw new Error("Token was not provided to client!");
        if (typeof token !== "string") throw new Error(`Token type must be a string, received ${typeof token}!`);
        super();
        /**
         * Token of the client
         */
        this.token = token;

        /**
         * WebSocketManager
         */
        this.ws = new WebSocket(this);

        /**
         * Client constants
         */
        this.constants = Constants;
        
        /**
         * Timestamp when client connected to discord
         */
        this.readyAt = null;

        /**
         * Client user
         */
        this.user = null;

        /**
         * Users
         */
        this.users = new Collection();

        /**
         * Channels
         */
        this.channels = new Collection();

        /**
         * Guilds
         */
        this.guilds = new Collection();

        /**
         * Messages
         */
        this.messages = new Collection();

        this.rest = Rest;
        
        this.ws.on("ready", (data) => {
            this.readyAt = new Date();
            this.user = new ClientUser(this, data);
            this.emit("ready");
        });

        this.ws.on("message", (m) => {
            m = new Message(this, m);
            this.emit("message", m);
        });

        this.ws.on("messageDelete", (m) => {
            let cached = this.messages.get(m.id);
            this.emit("messageDelete", cached || m);
        });

        this.ws.on("debug", (m) => {
            this.emit("debug", m);
        });
    }

    /**
     * Connect to discord
     */
    async run() {
        this.emit("debug", `TOKEN: ${this.token}`);
        try {
            this.emit("debug", "Logging in...");
            this.ws.login(this.token);
            return this.token;
        } catch(e) {
            throw e;
        }
    }

    /**
     * Client uptime
     */
    get uptime() {
        if (this.readyAt !== null) return Date.now() - this.readyAt.getTime();
        return 0;
    }

    /**
     * Timestamp when client connected to discord
     */
    get readyTimestamp() {
        return this.readyAt.getTime();
    }

    /**
     * Send message
     * @param {String} channel Channel ID
     * @param {Object} data message data
     */
    sendMessage(channel, data) {
        return new Promise((resolve, reject) => {
            if (!this.readyAt || this.readyAt == null) return reject(new Error("Client is not ready!"));
            if (!channel) reject(new Error("No channel id was provided!"));
            
            let json = {};
            if (typeof data === "string") json.content = data;
            else if (typeof data === "object") json = data;
            else return reject(new Error("Invalid data type"));
            const url = `${this.constants.BASE_URL}${this.constants.API_VERSION}${this.constants.CHANNEL(channel)}/messages`;
            this.rest.post(url, {
                headers: {
                    "Authorization": `Bot ${this.token}`,
                    "Content-Type": "application/json"
                },
                body: json
            })
            .then(res => res.json())
            .then(data => {
                if (!data.id || !data.content) return resolve();
                const msg = new Message(this, data);
                resolve(msg);
            })
            .catch(reject);
        });
    }

    /**
     * Destroys client
     */
    destroy() {
        this.readyAt = null;
        this.ws.destroy();
        this.token = null;
    }

}

module.exports = Client;