import React, { useState, useRef, useEffect } from 'react';
import { MoodType } from './types';
import FerrisWheelCard from './components/FerrisWheelCard';
import RoadCard from './components/RoadCard';
import DeepSeaCard from './components/DeepSeaCard';
import MoodInput from './components/MoodInput';

const App: React.FC = () => {
  const [activeMood, setActiveMood] = useState<MoodType>(MoodType.EUPHORIC);
  const [isInputMode, setIsInputMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle scroll to detect active card
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const scrollPosition = containerRef.current.scrollTop;
    const height = containerRef.current.clientHeight;
    
    // Simple logic: whichever section takes up the majority of the view
    const index = Math.round(scrollPosition / height);
    
    if (index === 0) setActiveMood(MoodType.EUPHORIC);
    else if (index === 1) setActiveMood(MoodType.STABLE);
    else if (index === 2) setActiveMood(MoodType.DEPRESSED);
  };

  const handleCardClick = (mood: MoodType) => {
    setActiveMood(mood);
    setIsInputMode(true);
  };

  return (
    <div className="relative w-full h-screen bg-slate-900 font-sans">
      {/* Selection Screen */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar scroll-smooth"
      >
        {/* Card 1: Ferris Wheel */}
        <div className="h-screen w-full snap-start relative">
          <FerrisWheelCard 
            isActive={activeMood === MoodType.EUPHORIC} 
            onClick={() => handleCardClick(MoodType.EUPHORIC)}
          />
        </div>

        {/* Card 2: Road */}
        <div className="h-screen w-full snap-start relative">
          <RoadCard 
            isActive={activeMood === MoodType.STABLE} 
            onClick={() => handleCardClick(MoodType.STABLE)}
          />
        </div>

        {/* Card 3: Deep Sea */}
        <div className="h-screen w-full snap-start relative">
          <DeepSeaCard 
            isActive={activeMood === MoodType.DEPRESSED} 
            onClick={() => handleCardClick(MoodType.DEPRESSED)}
          />
        </div>
      </div>

      {/* Navigation Indicators (Dots) */}
      {!isInputMode && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-40">
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${activeMood === MoodType.EUPHORIC ? 'bg-white scale-150' : 'bg-white/30'}`} />
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${activeMood === MoodType.STABLE ? 'bg-white scale-150' : 'bg-white/30'}`} />
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${activeMood === MoodType.DEPRESSED ? 'bg-white scale-150' : 'bg-white/30'}`} />
        </div>
      )}

      {/* Prompt Text Overlay (Bottom) */}
      {!isInputMode && (
        <div className="fixed bottom-10 left-0 w-full text-center z-40 pointer-events-none">
           <p className="text-white/50 text-xs tracking-widest uppercase animate-pulse">
             上下滑动选择 • 点击记录
           </p>
        </div>
      )}

      {/* Input Overlay */}
      {isInputMode && (
        <MoodInput 
          mood={activeMood} 
          onBack={() => setIsInputMode(false)} 
        />
      )}
    </div>
  );
};

export default App;