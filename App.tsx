
import React, { useState, useRef, useEffect } from 'react';
import { MoodType } from './types';
import FerrisWheelCard from './components/FerrisWheelCard';
import RoadCard from './components/RoadCard';
import DeepSeaCard from './components/DeepSeaCard';
import MoodInput from './components/MoodInput';
import BeliefTree from './components/BeliefTree';
import { ChevronRight, ChevronLeft, User, Sprout } from 'lucide-react';

const App: React.FC = () => {
  const [activeMood, setActiveMood] = useState<MoodType>(MoodType.EUPHORIC);
  const [inputActive, setInputActive] = useState(false);
  
  // View State: 0 = Profile (Left), 1 = Main (Center), 2 = Tree (Right)
  const [currentView, setCurrentView] = useState(1);
  
  const moodContainerRef = useRef<HTMLDivElement>(null);

  // Handle vertical scroll for Mood Cards (Only active in View 1)
  const handleMoodScroll = () => {
    if (!moodContainerRef.current) return;
    const scrollPosition = moodContainerRef.current.scrollTop;
    const height = moodContainerRef.current.clientHeight;
    const index = Math.round(scrollPosition / height);
    
    if (index === 0) setActiveMood(MoodType.EUPHORIC);
    else if (index === 1) setActiveMood(MoodType.STABLE);
    else if (index === 2) setActiveMood(MoodType.DEPRESSED);
  };

  const handleCardClick = (mood: MoodType) => {
    setActiveMood(mood);
    setInputActive(true);
  };

  const navigateTo = (viewIndex: number) => {
    if (viewIndex >= 0 && viewIndex <= 2) {
      setCurrentView(viewIndex);
    }
  };

  return (
    <div className="relative w-full h-screen bg-slate-900 font-sans overflow-hidden">
      
      {/* === GLOBAL HORIZONTAL CONTAINER === */}
      {/* Using transform to slide between pages. width = 300% */}
      <div 
        className="w-[300%] h-full flex transition-transform duration-500 ease-in-out will-change-transform"
        style={{ transform: `translateX(-${currentView * 33.333}%)` }}
      >
        
        {/* --- PAGE 0: LEFT (Profile/Placeholder) --- */}
        <div className="w-1/3 h-full bg-slate-950 flex flex-col items-center justify-center relative border-r border-white/5">
           <div className="text-center opacity-50">
             <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center">
               <User size={40} className="text-white/50" />
             </div>
             <h2 className="text-xl font-bold text-white tracking-widest">我的档案</h2>
             <p className="text-xs text-white/50 mt-2 uppercase tracking-wider">Coming Soon</p>
           </div>
           
           {/* Navigation Hint */}
           <button 
             onClick={() => navigateTo(1)}
             className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/30 hover:text-white animate-pulse"
           >
             <ChevronRight size={32} />
           </button>
        </div>

        {/* --- PAGE 1: CENTER (Main Mood Selector) --- */}
        <div className="w-1/3 h-full relative">
          
          {/* Vertical Scroll Mood Container */}
          <div 
            ref={moodContainerRef}
            onScroll={handleMoodScroll}
            className={`h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar scroll-smooth transition-opacity duration-500 ${inputActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            {/* Card 1 */}
            <div className="h-screen w-full snap-start relative">
              <FerrisWheelCard isActive={activeMood === MoodType.EUPHORIC && !inputActive} onClick={() => handleCardClick(MoodType.EUPHORIC)} />
            </div>
            {/* Card 2 */}
            <div className="h-screen w-full snap-start relative">
              <RoadCard isActive={activeMood === MoodType.STABLE && !inputActive} onClick={() => handleCardClick(MoodType.STABLE)} />
            </div>
            {/* Card 3 */}
            <div className="h-screen w-full snap-start relative">
              <DeepSeaCard isActive={activeMood === MoodType.DEPRESSED && !inputActive} onClick={() => handleCardClick(MoodType.DEPRESSED)} />
            </div>
          </div>

          {/* Navigation Controls (Arrows) */}
          {!inputActive && (
            <>
              {/* Go Left */}
              <button 
                onClick={() => navigateTo(0)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-black/20 backdrop-blur-sm rounded-full text-white/50 hover:text-white hover:bg-black/40 transition-all"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Go Right (To Tree) */}
              <button 
                onClick={() => navigateTo(2)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-black/20 backdrop-blur-sm rounded-full text-emerald-200/70 hover:text-emerald-300 hover:bg-black/40 transition-all group flex items-center gap-2 pr-4"
              >
                <Sprout size={24} />
                <span className="hidden md:block text-xs font-bold uppercase tracking-wider">信念树</span>
                <ChevronRight size={20} />
              </button>

              {/* Vertical Indicators */}
              <div className="fixed right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-30 pointer-events-none">
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeMood === MoodType.EUPHORIC ? 'bg-white scale-150' : 'bg-white/30'}`} />
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeMood === MoodType.STABLE ? 'bg-white scale-150' : 'bg-white/30'}`} />
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeMood === MoodType.DEPRESSED ? 'bg-white scale-150' : 'bg-white/30'}`} />
              </div>
              
              {/* Bottom Hint */}
              <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-full text-center">
                 <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase animate-pulse">
                   ← 档案 &nbsp; • &nbsp; 滑动选择 &nbsp; • &nbsp; 信念树 →
                 </p>
              </div>
            </>
          )}
        </div>

        {/* --- PAGE 2: RIGHT (Belief Tree) --- */}
        <div className="w-1/3 h-full relative">
          <BeliefTree onBack={() => navigateTo(1)} />
        </div>

      </div>

      {/* === GLOBAL OVERLAY: MOOD INPUT === */}
      {/* Moved outside the 300% width container to prevent layout stretching */}
      {inputActive && (
        <div className="fixed inset-0 z-[100]">
          <MoodInput 
            mood={activeMood} 
            onBack={() => {
              setInputActive(false);
            }} 
          />
        </div>
      )}

    </div>
  );
};

export default App;
