const Snowflake = require("../util/Snowflake");

class User {

    constructor(client, data) {
        this._client = client;
        this._patch(data);
    }

    _patch(data) {
        this.id = data.id || null;
        this.username = data.username || null;
        this.discriminator = data.discriminator || null;
        this.avatar = data.avatar || null;
        this.bot = !!data.bot;
        this.system = !!data.system;
        this.verified = !!data.verified;
        this.mfaEnabled = !!data.mfa_enabled;
        this.flags = data.public_flags || 0;
        this.publicFlags = data.flags || 0;
        this.email = data.email || null;
        this.lastMessageID = null;
        this.lastMessage = null;
        this._client.users.set(this.id, this);
    }

    /**
     * User created date
     */
    get createdAt() {
        if (!this.id || this.id == null) return null;
        let obj = Snowflake.deconstruct(this.id);
        return obj.date;
    }

    /**
     * User created timestamp
     */
    get createdTimestamp() {
        return this.createdAt == null ? null : this.createdAt.getTime();
    }

    /**
     * Default avatar url
     */
    get defaultAvatarURL() {
        return `${this._client.constants.CDN}/embed/avatars/${this.discriminator % 5}.png`
    }

    /**
     * User avatar url
     * @param {Object} options avatar options
     */
    avatarURL(options = {}) {
        if (typeof options !== "object") throw new Error("Options type must be an object!");
        if (this.avatar === null) return null;
        if (!options.format) options.format = "webp";
        if (!options.size) options.size = 1024;
        if (!options.dynamic) options.dynamic = true;
        const url = `${this._client.constants.CDN}/avatars/${this.id}/${this.avatar}.${options.dynamic && this.avatar.startsWith("a_") ? "gif" : options.format}?size=${options.size}`;
        return url;
    }

    /**
     * Display avatar url of a user
     * @param {Object} options avatar options
     */
    displayAvatarURL(options = {}) {
        if (typeof options !== "object") throw new Error("Options type must be an object!");
        if (!options.format) options.format = "webp";
        if (!options.size) options.size = 1024;
        if (!options.dynamic) options.dynamic = true;
        const url = this.avatar ? this.avatarURL(options) : this.defaultAvatarURL;
        return url;
    }

    /**
     * Username + Discriminator
     */
    get tag() {
        if (this.username !== null && this.discriminator !== null) return `${this.username}#${this.discriminator}`;
        return null;
    }

    /**
     * String representation of client
     */
    toString() {
        return this.id ? `<@${this.id}>` : null;
    }
}

module.exports = User;