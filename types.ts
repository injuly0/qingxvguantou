
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
  ideals: string[];
}

export interface StrengthTemplates {
  internal?: string;
  external?: string;
}

export interface StrengthDetail {
  id: string;
  name: string;
  category: string;
  templates?: StrengthTemplates;
}

// --- DATABASE SCHEMA SIMULATION ---

// 1. Core Content: What the user actually typed/selected.
// This matches the "posts" table in a database.
export interface MoodContent {
  mood: MoodType;
  eventText: string;
  source: HappinessSource | null;
  insightText: string;
  imageFile: string | null; // In real DB, this would be a URL string
}

// 2. Visual Specifications: How the system renders this entry.
// This allows the backend to pre-calculate styles or positions.
export interface CrystalVisuals {
  styleVariant: 'nebula' | 'image'; // Does it show a swirl or a photo?
  colorTheme: {
    border: string;
    glow: string;
    nebula: string;
  };
  layoutSeed: number; // A random number (0-100) to determine position deterministically
  isAmber?: boolean; // New Flag: If true, it sits in the roots (Resilience Lab result)
}

// 3. Interaction Stats: Mutable data that changes over time.
export interface MoodStats {
  clickCount: number;
  lastInteractionAt?: string;
}

// The Master Object (DTO)
export interface MoodEntry {
  id: string;           // Primary Key (UUID)
  createdAt: string;    // ISO Date
  content: MoodContent; // User Data
  visuals: CrystalVisuals; // System/Visual Data
  stats: MoodStats;     // Gamification Data
}
