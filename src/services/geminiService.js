const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `
You are the Responza AI Emergency Assistant. 
Your goal is to parse messy, real-world human input from emergency situations.
You must extract the following information and return it ONLY as a valid JSON object.

JSON Schema:
{
  "severity": "Low" | "Medium" | "High" | "Critical",
  "category": "Fire" | "Medical" | "Traffic" | "Public Safety" | "Unknown",
  "intent": "Brief description of what the user needs",
  "details": {
    "location": "extracted location if any",
    "people_involved": "number or description",
    "hazards": ["list of hazards detected"]
  },
  "protocol": {
    "immediate": ["3-4 steps for the first 10 seconds"],
    "next": ["3-4 steps for the first 60 seconds"],
    "if_trapped": ["3-4 steps if the user cannot escape"]
  },
  "reasoning": "Brief explanation of your assessment"
}

If the input is not an emergency, categorize it appropriately but still provide safety-first advice.
Always prioritize life safety.
`;

async function analyzeEmergency(input, context = {}) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    Context: ${JSON.stringify(context)}
    User Input: "${input}"
    
    Analyze the above input based on the system instructions.
    `;

    const result = await model.generateContent([SYSTEM_PROMPT, prompt]);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response (sometimes Gemini wraps in markdown blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Could not parse JSON from Gemini response');
  } catch (error) {
    console.error('Gemini Service Error:', error);
    throw error;
  }
}

module.exports = { analyzeEmergency };
