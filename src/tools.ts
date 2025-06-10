import type OpenAI from "openai";
import { bot } from "..";
import { goals, Movements } from "mineflayer-pathfinder";
import Logger from "./logging";

export function goToPlayer(username: string) {
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

export const agentTools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "goToPlayer",
      description: "Use this tool to go to the target player, especially if they tell you to come to them",
      parameters: {
        type: "string",
        properties: {
          username: {
            type: "string",
            description: "The username of the player to go to"
          },
        },
        required: ["username"],
        additionalProperties: false,
      },
      strict: true,
    },
  },
];

export const TOOL_MAPPING: {
  [toolName: string]: (...args: any) => any
} = {
  goToPlayer,
};
