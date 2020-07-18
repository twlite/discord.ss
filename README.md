# Discord.ss
Simple api wrapper for discord written in JavaScript.

# Note
Don't use this package. This package is under development.

# Events
- message
- ready
- error
- reconnecting
- resume
- messageDelete
- debug

# Example

```js
const Discord = require("discord.ss");
const client = new Discord.Client("TOKEN");

client.on("ready", () => {
    console.log("I am ready");
});

client.on("message", async (message) => {
    if (message.author.bot) return;
    if (message.content === "!ping") {
        return client.sendMessage(message.channelID, "Pong!");
    }
    if (message.content === "!embed") {
        const embed = new Discord.MessageEmbed()
            .setTitle("Embed")
            .setColor("#7289DA")
            .setThumbnail(message.author.displayAvatarURL());
        client.sendMessage(message.channelID, embed);
    }
});

client.run();
```

# Discord
**[https://discord.gg/2SUybzb](https://discord.gg/2SUybzb)**