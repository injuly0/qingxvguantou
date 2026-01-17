
import { MoodType, CrystalVisuals, MoodContent } from "../types";

/**
 * Factory function to generate the "Spec" for a crystal ball.
 */
export const generateCrystalSpec = (content: MoodContent): CrystalVisuals => {
  // 1. Determine Style Variant
  const styleVariant = content.imageFile ? 'image' : 'nebula';
  const isAmber = content.mood === MoodType.DEPRESSED;

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
      // Amber Style: Warm, fossil-like colors
      colorTheme = {
        border: 'border-amber-700/50',
        glow: 'shadow-[0_0_20px_rgba(217,119,6,0.4)]',
        nebula: 'from-amber-900 via-yellow-900 to-orange-900' // Earthy tones
      };
      break;
  }

  // 3. Generate a deterministic seed for positioning
  const layoutSeed = Math.floor(Math.random() * 100);

  return {
    styleVariant,
    colorTheme,
    layoutSeed,
    isAmber
  };
};

/**
 * Calculates the CSS Top/Left position.
 * Updated to handle "Ambers" which sit at the bottom (roots).
 */
export const calculatePosition = (
  treeLevel: number, 
  rankIndex: number, 
  totalCount: number, 
  seed: number,
  isAmber?: boolean
) => {
  let topPercent = 0;
  let leftPercent = 0;

  if (isAmber) {
    // --- AMBER LOGIC (ROOTS) ---
    // They inhabit the bottom 15% of the container (85% to 98%)
    topPercent = 85 + (seed % 13); 
    
    // Spread across the width (10% to 90%)
    leftPercent = 10 + (seed % 80); 
    
    return { top: `${topPercent}%`, left: `${leftPercent}%` };
  }

  // --- CRYSTAL BALL LOGIC (BRANCHES) ---
  if (treeLevel === 1) {
    // Sapling: Cluster tightly at bottom center
    topPercent = 50 + (rankIndex / Math.max(totalCount, 1)) * 20; 
    leftPercent = 40 + (seed % 20); // 40-60%
  } else if (treeLevel === 2) {
    // Young Tree: Mid spread
    topPercent = 30 + (rankIndex / Math.max(totalCount, 1)) * 40;
    leftPercent = 20 + (seed % 60); // 20-80%
  } else {
    // Mature Tree: Full height
    // We adjust top to not overlap with roots (stop at 85%)
    const rankRatio = rankIndex / Math.max(totalCount, 1);
    topPercent = 10 + rankRatio * 65; 
    
    // Triangle spread
    const spreadWidth = 20 + rankRatio * 60; 
    const randomOffset = seed / 100; // 0 to 1
    leftPercent = (50 - spreadWidth/2) + randomOffset * spreadWidth;
  }

  return { top: `${topPercent}%`, left: `${leftPercent}%` };
};
