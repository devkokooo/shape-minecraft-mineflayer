import OpenAI from "openai";
import Logger from "./logging";
import { agentTools, TOOL_MAPPING } from "./tools";

// Register Shapes client with OpenAI-compatible API
const shapesClient = new OpenAI({
  apiKey: process.env.SHAPESINC_API_KEY,
  baseURL: process.env.DEBUG === "true"
    ? "http://localhost:8090/v1" : "https://api.shapes.inc/v1",
});

export async function chatWithShape(message: string): Promise<string | undefined | null> {
  Logger.log("Sending prompt to Shapes API...");
  const response = await shapesClient.chat.completions.create({
    model: `shapesinc/${process.env.SHAPESINC_SHAPE_USERNAME}`,
    messages: [
      { role: "user", content: message },
    ],
    tools: agentTools,
    tool_choice: "auto",
  });

  Logger.log(JSON.stringify(response), "shapes-api");

  // When tool_choice=auto, models can choose between tool use OR generating a message
  // Some models like LLama 4 Maverick would try to perform tool use as a message
  // Gemini 2.0 and 2.5 models can do both OpenAI-styled tool use AND generate a message
  // Weirdly, Llama 3.3 70b (Turbo) does OpenAI-styled tool use
  const finishReason = response.choices[0]?.finish_reason;
  Logger.log(`finish_reason: ${finishReason}`, "shapes-api");

  // OpenAI-styled tool calls
  const openaiToolCalls = response.choices[0]?.message.tool_calls;

  if (openaiToolCalls) {
    Logger.log("We've got OpenAI tool calls!");
    for (const toolCall of openaiToolCalls) {
      const toolCallId = toolCall?.id;
      const toolName = toolCall.function.name;
      const toolFnArgs = JSON.parse(toolCall?.function.arguments!);

      Logger.log(`tool_id: ${toolCallId}, tool_name: ${toolName}, tool_args: ${JSON.stringify(toolFnArgs)}`, "shapes-api");

      if (toolName && toolName in TOOL_MAPPING) {
        const arg = Object.values(toolFnArgs);
        TOOL_MAPPING[toolName]!(arg);
      }
    }
  }

  // LLama-styled message tool calls
  const responseMsg = response.choices[0]?.message.content;
  const llamaToolCalls = responseMsg?.match(/\[(.*?)\]/g);

  if (llamaToolCalls) {
    Logger.log("We've got LLama tool calls!");

    for (const call of llamaToolCalls) {
      const tool = call.slice(1, -1);
      Logger.log(tool);

      const [toolName, toolArgs] = tool.split("(");
      const args = toolArgs ? toolArgs.slice(0, -1) : "";
      const argPair = args.split("=").map(pair => pair.trim());

      Logger.log("tool: " + toolName);
      Logger.log("args: " + args);
      Logger.log(`{ ${argPair[0]}: ${argPair[1]} }`);

      if (toolName && toolName in TOOL_MAPPING) {
        TOOL_MAPPING[toolName]!(argPair[1]);
      }
    }
  }

  return responseMsg;
}
