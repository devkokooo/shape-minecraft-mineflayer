import OpenAI from "openai";
import mineflayer from "mineflayer";
import { pathfinder, Movements, goals } from "mineflayer-pathfinder";

// 1. Register Shapes client with OpenAI-compatible API
const shapesClient = new OpenAI({
  apiKey: process.env.SHAPESINC_API_KEY,
  baseURL: "https://api.shapes.inc/v1",
});

// 2. Create Mineflayer bot, connect to Minecraft server, register plugins
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
  console.log(`${process.env.MINEFLAYER_USERNAME} successfully spawned in`);
});

bot.on("chat", (username, message) => {
  if (username === bot.username) return;

  // 3. 'come' command to pathfind to player
  if (message.match(/come/gmi)) {
    console.log("Finding target player...");
    const target = bot.players[username] ? bot.players[username].entity : null;

    if (!target) {
      console.log("Target not found...");
      bot.chat("I don't see you!");
      return;
    }

    console.log("Target found! @ " + target.position);
    console.log("Pathfinding to target now...");
    const pos = target.position;
    const defaultMove = new Movements(bot);
    bot.pathfinder.setMovements(defaultMove);
    bot.pathfinder.setGoal(new goals.GoalNear(pos.x, pos.y, pos.z, 1));
  }
})

bot.on("death", () => {
  bot.removeAllListeners();
});

bot.on("kicked", console.log);
bot.on("error", console.log);
