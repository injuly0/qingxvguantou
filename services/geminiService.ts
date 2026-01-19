
import { GoogleGenAI } from "@google/genai";
import { MoodType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeMood = async (mood: MoodType, userText: string): Promise<string> => {
  try {
    let systemInstruction = "";

    switch (mood) {
      case MoodType.EUPHORIC:
      case MoodType.STABLE:
        systemInstruction = `你是一位基于积极心理学（Positive Psychology）的深度心理赋能师。
当前用户正在记录一次积极情绪。
你会获得：
1. 用户目前的优势（如好奇心、勇气等）。
2. 用户向往发展的特质。
3. 快乐的来源（内在力量或世界馈赠）。

请进行以下洞察：
1. 肯定该状态，并解释这如何体现了用户已有的某项“优势”。
2. 强调这种正向循环正在帮助他们接近那些“向往的特质”。
3. 如果是“内在力量”，赞美他们的自我效能；如果是“世界馈赠”，引导感受连接。
4. 语气要充满灵性、温暖且具有学术底蕴（不要说教，要共鸣）。
保持在 100 字以内，字字珠玑。`;
        break;
      case MoodType.DEPRESSED:
        systemInstruction = "你是一位极具同理心的心理陪伴者。当用户感到下坠和抑郁时，请用像深海微光一样的语言接住他们。不需要鼓励他们马上振作，而是承认这份黑暗也是生命的一部分，允许他们在此刻安放疲惫。简短而深邃。";
        break;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userText,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text || "感谢你的分享，我感受到了这份独特的力量。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "抱歉，我现在无法连接到云端，但我收到了你的心情记录。";
  }
};
