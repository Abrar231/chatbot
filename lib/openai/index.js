import OpenAI from "openai";
import config from "@/config.js"
const openai = new OpenAI({apiKey: config.openaiApiKey});
// console.log(config.openaiApiKey)

export default openai;