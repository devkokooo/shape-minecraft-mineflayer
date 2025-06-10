import mineflayer from "mineflayer";
import { pathfinder, Movements, goals } from "mineflayer-pathfinder";
import Logger from "./logging";
import { chatWithShape } from "./shapes";

// Create Mineflayer bot, connect to Minecraft server, register plugins
const botOptions: mineflayer.BotOptions = {
  host: process.env.MINECRAFT_HOST_IP,
  port: parseInt(process.env.MINECRAFT_SERVER_PORT!),
  username: process.env.MINEFLAYER_USERNAME || "Shape",
  version: "1.21.4", // Can change to whichever version you want
  auth: "offline",
}

const bot = mineflayer.createBot(botOptions);

bot.loadPlugin(pathfinder);

bot.on("spawn", () => {
  Logger.log(`${bot.username} successfully spawned in`, "mineflayer");
});

bot.on("chat", async (username, message) => {
  if (username === bot.username) return;

  Logger.log(`<${username}> ${message}`, "mineflayer");

  // 'come' command to pathfind to player
  if (message.match(/come/gmi)) {
    Logger.log("Finding target player...", "mineflayer");
    const target = bot.players[username] ? bot.players[username].entity : null;

    if (!target) {
      Logger.log("Target not found...", "mineflayer");
      bot.chat("I don't see you!");
      return;
    }

    Logger.log("Target found! @ " + target.position, "mineflayer");
    Logger.log("Pathfinding to target now...", "mineflayer");
    const pos = target.position;
    const defaultMove = new Movements(bot);
    bot.pathfinder.setMovements(defaultMove);
    bot.pathfinder.setGoal(new goals.GoalNear(pos.x, pos.y, pos.z, 1));
  }
  else {
    const response = await chatWithShape(message);

    if (response && response.length) {
      Logger.log(`<${bot.username}> ${response}`, "mineflayer");
      bot.chat(response);
    }
  }
});

bot.on("death", () => {
  bot.removeAllListeners();
});

bot.on("kicked", console.log);
bot.on("error", console.log);
