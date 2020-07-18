const User = require("./User");

class Message {

    constructor(client, data) {
        this.client = client;
        this._patch(data);
    }

    _patch(data) {
        this.id = data.id || null;
        this.type = data.type || 0;
        this.tts = !!data.tts;
        this.createdAt = data.timestamp ? new Date(data.timestamp) : null;
        this.createdTimestamp = data.timestamp ? new Date(data.timestamp).getTime() : null;
        this.pinned = !!data.pinned;
        this.nonce = data.nonce || null;
        this.mentions = data.mentions || null;
        this.mentionedRoles = data.mention_roles || null;
        this.mentionedEveryone = !!data.mention_everyone;
        this.member = data.member || null;
        this.flags = data.flags || 0;
        this.embeds = data.embeds || [];
        this.editedTimestamp = data.edited_timestamp || null;
        this.editedAt = data.edited_timestamp ? new Date(data.edited_timestamp) : null;
        this.content = data.content || null;
        this.channelID = data.channel_id || null;
        this.author = data.author ? this.client.users.get(data.author.id) ? this.client.users.get(data.author.id) : new User(this.client, data.author) : null;
        this.attachments = data.attachments || [];
        this.guildID = data.guild_id || null;

        this.client.messages.set(this.id, this);
    }

}

module.exports = Message;