import { GoogleGenAI } from "@google/genai";
import { MoodType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeMood = async (mood: MoodType, userText: string): Promise<string> => {
  try {
    let systemInstruction = "";

    switch (mood) {
      case MoodType.EUPHORIC:
      case MoodType.STABLE:
        systemInstruction = `你是一位深度心理赋能师。
当前用户正在记录一次积极情绪。
如果输入中包含"用户优势"、"理想特质"和"快乐来源"，请进行以下深度洞察：
1. 肯定用户的这种状态，并将这种快乐与他们选择的"优势"联系起来。
2. 如果是"内在力量"引发的，特别强调这是他们主动塑造生活的结果。
3. 如果是"世界馈赠"，引导他们感受当下的连接感和感恩。
4. 鼓励他们如何运用这些优势去接近那个"理想特质"的自己。
5. 语气要充满力量、真诚、且具有洞察力。
保持回复在 100 字以内，字字珠玑。`;
        break;
      case MoodType.DEPRESSED:
        systemInstruction = "你是一位共情能力很强的心理倾听者。用户现在感觉像在深海下坠，有窒息感，压抑或悲伤。请非常温柔地接住他们的情绪，告诉他们你在陪着他们，不需要急着浮出水面，在这里休息一下也是可以的。语气要极其温柔、舒缓，像微弱的光。保持简短。";
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