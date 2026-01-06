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
  strengths: string[];
  idealTrait: string;
}

export interface MoodConfig {
  type: MoodType;
  title: string;
  description: string;
  color: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}