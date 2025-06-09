import OpenAI from "openai";
import mineflayer from "mineflayer";

// 1. Register Shapes client with OpenAI-compatible API
const shapesClient = new OpenAI({
  apiKey: process.env.SHAPESINC_API_KEY,
  baseURL: "https://api.shapes.inc/v1",
});

// 2. Create Mineflayer bot and connect to Minecraft server
const botOptions: mineflayer.BotOptions = {
  host: process.env.MINECRAFT_HOST_IP,
  port: parseInt(process.env.MINECRAFT_SERVER_PORT!),
  username: process.env.MINEFLAYER_USERNAME || "Shape",
  version: "1.21.4", // Can change to whichever version you want
  auth: "offline",
}

const bot = mineflayer.createBot(botOptions);

bot.on("spawn", () => {
  console.log(`${process.env.MINEFLAYER_USERNAME} successfully spawned in`);
});

bot.on("chat", (username, message) => {
  if (username === bot.username) return;
  bot.chat(message);
})

bot.on("kicked", console.log);
bot.on("error", console.log);
