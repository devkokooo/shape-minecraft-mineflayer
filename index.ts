import mineflayer from "mineflayer";
import { pathfinder } from "mineflayer-pathfinder";
import Logger from "./src/logging";
import { chatWithShape } from "./src/shapes";

// Create Mineflayer bot, connect to Minecraft server, register plugins
const botOptions: mineflayer.BotOptions = {
  host: process.env.MINECRAFT_HOST_IP,
  port: parseInt(process.env.MINECRAFT_SERVER_PORT!),
  username: process.env.MINEFLAYER_USERNAME || "Shape",
  version: "1.21.4", // Can change to whichever version you want
  auth: "offline",
}

export const bot = mineflayer.createBot(botOptions);

bot.loadPlugin(pathfinder);

bot.on("spawn", () => {
  Logger.log(`${bot.username} successfully spawned in`, "mineflayer");
});

bot.on("chat", async (username, message) => {
  if (username === bot.username) return;

  Logger.log(`<${username}> ${message}`, "mineflayer");

  const response = await chatWithShape(message);
  if (!response) return;

  Logger.log("Response received!");
  Logger.log("Sending return message to Mineflayer bot...");
  Logger.log(`<${bot.username}> ${response}`, "mineflayer");
  bot.chat(response);
});

bot.on("death", () => {
  bot.removeAllListeners();
});

bot.on("kicked", console.log);
bot.on("error", console.log);
