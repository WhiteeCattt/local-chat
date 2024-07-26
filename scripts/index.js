console.warn("Аддон «Локальный чат» успешно загружен!");
import { world } from "@minecraft/server";
import config from "./config";

let coooldowns = {};
world.beforeEvents.chatSend.subscribe((data) => {
    const { sender: player, message } = data;
    data.cancel = true;
    if (!coooldowns[player.name]) coooldowns[player.name] = 0;
    if (coooldowns[player.name] > Date.now()) return player.sendMessage("§cНе флудите!");
    coooldowns[player.name] = Date.now() + 1000 * config.cooldown;
    if (message.startsWith(config.prefix)) {
        world.sendMessage(`[§gG§f] ${getRank(player)} ${player.name} » ${message.replace(config.prefix, "")}`);
    } else {
        const { x, y, z } = player.location;
        for (const target of world.getAllPlayers()) {
            const { x: x1, y: y1, z: z1 } = target.location;
            if (Math.sqrt(Math.pow(x1 - x, 2) + Math.pow(y1 - y, 2) + Math.pow(z1 - z, 2)) > config.distance) continue;
            target.sendMessage(`[§bL§f] ${getRank(player)} ${player.name} » ${message}`);
        }
    }
});

function getRank(player) {
    return player.getTags().filter(t => t.startsWith(config.ranks.prefix))[0] ?? config.ranks.default + "§r";
}
