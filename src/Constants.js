module.exports = {
    BASE_URL: "https://discord.com/api/v",
    CDN: "https://cdn.discordapp.com",
    GATEWAY_URL: "wss://gateway.discord.gg",
    API_VERSION: 7,
    GATEWAY_VERSION: 6,
    OS: require("os").platform(),
    BROWSER: "DiscordScript",
    DEVICE: "DiscordScript",
    OP_CODES: {
        DISPATCH: 0,
        HEARTBEAT: 1,
        IDENTIFY: 2,
        PRESENCE_UPDATE: 3,
        VOICE_STATE_UPDATE: 4,
        RESUME: 6,
        RECONNECT: 7,
        REQUEST_GUILD_MEMBERS: 8,
        INVALID_SESSION: 9,
        HELLO: 10,
        HEARTBEAT_ACK: 11,
        0: "Dispatch",
        1: "Heartbeat",
        2: "Identify",
        3: "Presence Update",
        4: "Voice State Update",
        6: "Resume",
        7: "Reconnect",
        8: "Request Guild Members",
        9: "Invalid Session",
        10: "Hello",
        11: "Heartbeat ACK"
    },
    GATEWAY_ERRORS: {
        0: "Gateway Error",
        4000: "Unknown error",
        4001: "Unknown opcode",
        4002: "Decode error",
        4003: "Not authenticated",
        4004: "Authentication failed",
        4005: "Already authenticated",
        4007: "Invalid seq",
        4008: "Rate limited",
        4009: "Session timed out",
        4010: "Invalid shard",
        4011: "Sharding required",
        4012: "Invalid API version",
        4013: "Invalid intents",
        4014: "Disallowed intents"
    },
    USER: (id) => `/users/${id}`,
    CHANNELS: (id) => `/users/${id}/channels`,
    CHANNEL: (id) => `/channels/${id}`,
    GUILDS: (id) => `/users/${id}/guilds`,
    GUILD: (id) => `/guilds/${id}`,
    GUILD_MEMBERS: (id) => `/guilds/${id}/members`,
    GUILD_MEMBER: (id, mid) => `/guilds/${id}/members/${mid}`,
};