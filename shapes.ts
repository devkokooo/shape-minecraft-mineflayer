import OpenAI from "openai";
import Logger from "./logging";

// Register Shapes client with OpenAI-compatible API
const shapesClient = new OpenAI({
  apiKey: process.env.SHAPESINC_API_KEY,
  baseURL: "https://api.shapes.inc/v1",
});

export async function chatWithShape(message: string): Promise<string | null | undefined> {
  Logger.log("Sending prompt to Shapes API...", "system");
  const response = await shapesClient.chat.completions.create({
    model: `shapesinc/${process.env.SHAPESINC_SHAPE_USERNAME}`,
    messages: [
      { role: "user", content: message },
    ],
  });

  Logger.log(JSON.stringify(response), "shapes-api");

  Logger.log("Response received! Sending to Mineflayer bot...", "system");
  const responseMsg = response.choices[0]?.message.content;

  return responseMsg;
}
