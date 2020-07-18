const { EventEmitter } = require("events");
const ws = require("ws");
const Constants = require("../Constants");
const Payload = require("./Payload");
const Zlib = require("zlib-sync");

class WebsocketManager extends EventEmitter {

    /**
     * Creates new WebsocketManager
     * @param {Client} client Client
     */
    constructor(client) {
        super();
        this._client = client;
        /**
         * Represents websocket
         */
        this._ws = null;

        /**
         * Ready state
         */
        this._ready = false;

        /**
         * Disconnected state
         */
        this._disconnected = false;
    }

    /**
     * Login to discord
     * @param {String} token 
     */
    login(token) {
        this.emit("debug", "Connecting...");
        this._ws = new ws(`${Constants.GATEWAY_URL}/?v=${Constants.GATEWAY_VERSION}&encoding=json`);
        this._ws.once("open", () => {
            this.emit("debug", "Opened websocket connection!");
            this._identify({ token });
        });
        this._ws.once("close", this._handleClose.bind(this));
        this._ws.once("error", this._error.bind(this));
        this._ws.on("message", this._handleMessages.bind(this));
    }

    /**
     * Sends identify payload
     * @param {Payload} data Payload
     */
    _identify(data) {
        if (this._ws !== null && this._ws.readyState !== this._ws.CLOSED) {
            this.emit("debug", "Identifying...");
            const payload = Payload.IDENTIFY(data);
            return this.send(payload);
        }
    }

    /**
     * Handles closed state
     */
    _handleClose() {
        if (this._ws !== null && !this._disconnected) {
            this.emit("reconnecting");
            setTimeout(() => {
                this.login(this._client.token);
                this.emit("resume");
            }, 1000);
        }
    }

    /**
     * Handles error
     * @param {Error} err Error
     */
    _error(err) {
        if (this._ws !== null && err) this.emit("error", err);
    }

    /**
     * Sends payload to discord
     * @param {Payload} payload Payload to send
     */
    send(payload) {
        this.emit("debug", `Sending payload ${Constants.OP_CODES[payload.op]}`);
        return this._ws.send(JSON.stringify(payload));
    }

    /**
     * Handles incoming websocket message
     * @param data Incoming data
     * @param flags data flags
     */
    _handleMessages(data, flags) {
        const message = this._decompress(data, flags);
        switch(message.t) {
            case "READY":
                if (!this._ready) {
                    this._ready = true;
                    this.emit("ready", message.d.user);
                    this.emit("debug", "Successfully connected!");
                }
                break;
            case "MESSAGE_CREATE":
                this.emit("message", message.d);
                break;
            case "MESSAGE_DELETE":
                this.emit("messageDelete", message.d);
                break;
        }
    }

    /**
     * Decompress websocket message
     * @param data data
     * @param flags flags
     */
    _decompress(data, flags) {
        if (typeof flags !== "object") flags = {};
        if (!flags.binary) return JSON.parse(data);
        const inf = new Zlib.Inflate();
        inf.push(data, Zlib.Z_SYNC_FLUSH);
        if (inf.err > 0) throw new Error(`Error while decompressing message: ${inf.msg}`);
        return JSON.parse(inf.toString());
    }

    /**
     * Terminates websocket connection
     */
    destroy() {
        if (this._disconnected) return;
        this._ws.terminate();
        this._disconnected = true;
        this.emit("debug", "terminated websocket connection!");
    }

}

module.exports = WebsocketManager;
