
import { MoodEntry, MoodContent } from "../types";
import { generateCrystalSpec } from "../utils/crystalBallSystem";

// DOCUMENTATION REFERENCE:
// Please see `docs/database_schema.md` for the backend database structure 
// that matches this service's data handling.
const STORAGE_KEY = 'mood_entries';

// --- API INTERFACE (Future Proofing) ---

export const StorageService = {
  /**
   * Create a new entry (INSERT)
   */
  async createEntry(content: MoodContent): Promise<MoodEntry> {
    // 1. Generate UUID & Timestamp
    // Use crypto.randomUUID() for modern standard, fallback if necessary (though rarely needed in modern browsers)
    const newId = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
    const createdAt = new Date().toISOString();

    // 2. Generate Visual Specifications (The "Backend" logic)
    const visuals = generateCrystalSpec(content);

    // 3. Initialize Stats
    const stats = {
      clickCount: 0
    };

    // 4. Construct the Full Record
    const newEntry: MoodEntry = {
      id: newId,
      createdAt,
      content,
      visuals,
      stats
    };

    // 5. Save (Replace this block with API POST later)
    const currentData = await this.getAllEntries();
    const updatedData = [...currentData, newEntry];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));

    return newEntry;
  },

  /**
   * Retrieve all entries (SELECT *)
   */
  async getAllEntries(): Promise<MoodEntry[]> {
    // Replace this with API GET later
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
      // Compatibility check: if old data exists, we might need a migration helper here
      // For now, assume fresh structure or handle gracefully
      return JSON.parse(stored);
    } catch (e) {
      console.error("Storage Error", e);
      return [];
    }
  },

  /**
   * Update interaction stats (UPDATE SET clickCount = ...)
   */
  async incrementClickCount(id: string): Promise<MoodEntry | null> {
    const entries = await this.getAllEntries();
    const index = entries.findIndex(e => e.id === id);
    
    if (index === -1) return null;

    // Update Logic
    const entry = entries[index];
    const updatedEntry = {
      ...entry,
      stats: {
        ...entry.stats,
        clickCount: (entry.stats.clickCount || 0) + 1,
        lastInteractionAt: new Date().toISOString()
      }
    };

    entries[index] = updatedEntry;
    
    // Save (Replace with API PUT later)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));

    return updatedEntry;
  }
};
