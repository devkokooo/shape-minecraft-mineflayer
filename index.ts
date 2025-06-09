import OpenAI from "openai";

// 1. Register Shapes client with OpenAI-compatible API
const shapesClient = new OpenAI({
  apiKey: process.env.SHAPESINC_API_KEY,
  baseURL: "https://api.shapes.inc/v1",
});

const response = await shapesClient.chat.completions.create({
  model: `shapesinc/${process.env.SHAPESINC_SHAPE_USERNAME}`,
  messages: [
    { role: "user", content: "hello, who are you?" }
  ],
});

console.log(response);