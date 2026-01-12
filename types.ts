
export enum MoodType {
  EUPHORIC = 'EUPHORIC', // Ferris Wheel
  STABLE = 'STABLE',     // Road
  DEPRESSED = 'DEPRESSED' // Deep Sea
}

export enum HappinessSource {
  EXTERNAL = 'EXTERNAL', // 感谢世界的馈赠
  INTERNAL = 'INTERNAL'  // 我发挥了内在力量
}

export interface UserTraits {
  strengths: string[]; // 当前拥有的优势
  ideals: string[];    // 向往的优势
}

export interface StrengthTemplates {
  internal?: string; // 内在力量模版 (Agency)
  external?: string; // 外在馈赠模版 (Connection)
}

export interface StrengthDetail {
  id: string;
  name: string;
  category: string;
  templates?: StrengthTemplates;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
