
import { MoodType, CrystalVisuals, MoodContent } from "../types";

/**
 * Factory function to generate the "Spec" for a crystal ball.
 * In a full-stack app, this logic might reside on the server during creation,
 * or remain on the client.
 */
export const generateCrystalSpec = (content: MoodContent): CrystalVisuals => {
  // 1. Determine Style Variant
  const styleVariant = content.imageFile ? 'image' : 'nebula';

  // 2. Generate Color Theme based on Mood
  let colorTheme = {
    border: 'border-white/50',
    glow: 'shadow-[0_0_15px_rgba(255,255,255,0.4)]',
    nebula: 'from-gray-100 to-gray-300'
  };

  switch (content.mood) {
    case MoodType.EUPHORIC:
      colorTheme = {
        border: 'border-amber-200/50',
        glow: 'shadow-[0_0_20px_rgba(251,191,36,0.6)]',
        nebula: 'from-amber-200 via-orange-400 to-red-500'
      };
      break;
    case MoodType.STABLE:
      colorTheme = {
        border: 'border-emerald-200/50',
        glow: 'shadow-[0_0_20px_rgba(52,211,153,0.6)]',
        nebula: 'from-emerald-200 via-teal-400 to-cyan-500'
      };
      break;
    case MoodType.DEPRESSED:
      colorTheme = {
        border: 'border-blue-200/50',
        glow: 'shadow-[0_0_20px_rgba(99,102,241,0.6)]',
        nebula: 'from-blue-200 via-indigo-400 to-purple-500'
      };
      break;
  }

  // 3. Generate a deterministic seed for positioning
  // This ensures the ball always appears in the "same random spot" for this ID
  const layoutSeed = Math.floor(Math.random() * 100);

  return {
    styleVariant,
    colorTheme,
    layoutSeed
  };
};

/**
 * Calculates the CSS Top/Left position based on the Tree Level and the ball's Seed.
 * This keeps the rendering logic pure.
 */
export const calculatePosition = (
  treeLevel: number, 
  rankIndex: number, 
  totalCount: number, 
  seed: number
) => {
  let topPercent = 0;
  let leftPercent = 0;

  if (treeLevel === 1) {
    // Sapling: Cluster tightly at bottom center
    topPercent = 40 + (rankIndex / Math.max(totalCount, 1)) * 30; 
    leftPercent = 40 + (seed % 20); // 40-60%
  } else if (treeLevel === 2) {
    // Young Tree: Mid spread
    topPercent = 20 + (rankIndex / Math.max(totalCount, 1)) * 40;
    leftPercent = 20 + (seed % 60); // 20-80%
  } else {
    // Mature Tree: Full height
    const rankRatio = rankIndex / Math.max(totalCount, 1);
    topPercent = 10 + rankRatio * 65; 
    
    // Triangle spread
    const spreadWidth = 20 + rankRatio * 60; 
    const randomOffset = seed / 100; // 0 to 1
    leftPercent = (50 - spreadWidth/2) + randomOffset * spreadWidth;
  }

  return { top: `${topPercent}%`, left: `${leftPercent}%` };
};
