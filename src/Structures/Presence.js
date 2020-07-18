function Presence (activity = {}, status = "online", afk = false, since = Date.now()) {
    let data = {};
    data.game = {};
    data.game.name = activity.name || null;
    data.game.type = activity.type || 0;
    data.game.url = activity.url || null;
    data.status = status || "online";
    data.afk = !!afk;
    data.since =  typeof since === "number" ? since : Date.now();
    
    return data;
}

module.exports = Presence;