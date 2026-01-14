
import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, X, Info, Zap } from 'lucide-react';
import { MoodEntry } from '../types';
import CalendarView from './CalendarView';
import { StorageService } from '../services/storageService';
import { calculatePosition } from '../utils/crystalBallSystem';

interface Props {
  onBack: () => void;
  refreshTrigger: number; // New prop to trigger re-fetch
}

const LEVEL_THRESHOLDS = {
  1: 3,  // 0-2 entries -> Level 1
  2: 8,  // 3-7 entries -> Level 2
  3: 999 // 8+ entries -> Level 3
};

const BeliefTree: React.FC<Props> = ({ onBack, refreshTrigger }) => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
  const [showLevelInfo, setShowLevelInfo] = useState(false);
  const [rechargeId, setRechargeId] = useState<string | null>(null);

  // Load data via Service
  // Added refreshTrigger to dependencies so it re-runs when parent signals update
  useEffect(() => {
    const loadData = async () => {
      const data = await StorageService.getAllEntries();
      setEntries(data);
    };
    loadData();
  }, [refreshTrigger]);

  // Calculate Level (Business Logic)
  const { level, progress, nextLevelTarget } = useMemo(() => {
    const count = entries.length;
    let lvl = 1;
    if (count >= LEVEL_THRESHOLDS[2]) lvl = 3;
    else if (count >= LEVEL_THRESHOLDS[1]) lvl = 2;

    let base = 0;
    let target = LEVEL_THRESHOLDS[1];

    if (lvl === 1) {
      base = 0;
      target = LEVEL_THRESHOLDS[1];
    } else if (lvl === 2) {
      base = LEVEL_THRESHOLDS[1];
      target = LEVEL_THRESHOLDS[2];
    } else {
      base = LEVEL_THRESHOLDS[2];
      target = LEVEL_THRESHOLDS[2] * 2;
    }

    const percentage = lvl === 3 ? 100 : Math.min(100, Math.max(0, ((count - base) / (target - base)) * 100));

    return { level: lvl, progress: percentage, nextLevelTarget: target };
  }, [entries.length]);

  // Handle Recharge Interaction
  const handleBallClick = async (entry: MoodEntry) => {
    setRechargeId(entry.id);
    setTimeout(() => setRechargeId(null), 1000);

    // Call Service API
    const updatedEntry = await StorageService.incrementClickCount(entry.id);
    
    if (updatedEntry) {
      setEntries(prev => prev.map(e => e.id === entry.id ? updatedEntry : e));
      setTimeout(() => {
        setSelectedEntry(updatedEntry);
      }, 300);
    }
  };

  // Generate Render List
  const ornaments = useMemo(() => {
    // 1. Sort by Priority (Clicks then Time)
    const sortedEntries = [...entries].sort((a, b) => {
      const countA = a.stats?.clickCount || 0;
      const countB = b.stats?.clickCount || 0;
      
      // If clicks are different, higher clicks go first
      if (countA !== countB) return countB - countA;
      
      // If clicks are same, newer entries go first (using createdAt instead of ID subtraction)
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return timeB - timeA;
    });

    // 2. Map to visual coordinates
    return sortedEntries.map((entry, index) => {
      // Use the helper to calculate position based on current Level and stored Seed
      // This is purely visual logic, safe to be here or in utility
      const position = calculatePosition(
        level, 
        index, 
        sortedEntries.length, 
        entry.visuals?.layoutSeed || 0
      );

      // Fallback for visual data if migrating from old version
      const theme = entry.visuals?.colorTheme || {
        border: 'border-white/50',
        glow: 'shadow-white',
        nebula: 'from-gray-100 to-gray-200'
      };

      return {
        ...entry,
        top: position.top,
        left: position.left,
        theme,
        delay: (index % 5) * 500
      };
    });
  }, [entries, level]);

  return (
    <div className="relative w-full h-full bg-slate-950 text-white flex flex-col items-center overflow-hidden animate-fade-in">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>

      {/* Header */}
      <div className="relative z-50 w-full p-6 flex justify-between items-start">
        <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest cursor-pointer hover:text-white transition-colors" onClick={onBack}>
           <ArrowLeft size={16} /> 
           <span>Swipe Back</span>
        </div>
        
        <div className="flex flex-col items-end cursor-pointer" onClick={() => setShowLevelInfo(!showLevelInfo)}>
          <div className="flex items-center gap-2 bg-indigo-500/20 backdrop-blur-md px-4 py-1 rounded-full border border-indigo-500/30">
             <span className="text-xs font-bold tracking-widest uppercase text-indigo-200">
               Level {level}
             </span>
             <Info size={14} className="text-indigo-300"/>
          </div>
          <div className="w-32 h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-[10px] mt-1 text-slate-500 font-mono">
             {entries.length} Memories
          </p>
        </div>
      </div>
      
      {showLevelInfo && (
        <div className="absolute top-20 right-6 z-50 w-64 bg-slate-900/90 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-2xl animate-fade-in-up">
           <h4 className="text-sm font-bold text-white mb-2">信念树成长指南</h4>
           <ul className="text-xs text-slate-400 space-y-2">
             <li className={level >= 1 ? 'text-amber-300' : ''}>🌱 Lv.1 萌芽：初次记录 (0-2)</li>
             <li className={level >= 2 ? 'text-amber-300' : ''}>🌳 Lv.2 生长：形成习惯 (3-7)</li>
             <li className={level >= 3 ? 'text-amber-300' : ''}>✨ Lv.3 繁茂：内心丰盈 (8+)</li>
           </ul>
           <p className="mt-3 text-[10px] text-indigo-300 border-t border-white/10 pt-2">
             💡 提示：点击水晶球可以为它“再次充能”，高能量的记忆会升至树冠。
           </p>
        </div>
      )}

      {/* TREE CONTAINER */}
      <div className="relative flex-1 w-full flex items-end justify-center pb-0 perspective-[1000px] overflow-hidden">
        
        {/* Tree Visuals */}
        {level === 1 && (
          <div className="relative w-40 h-60 flex flex-col items-center justify-end animate-tree-sway origin-bottom mb-20 opacity-80">
             <div className="absolute bottom-0 w-32 h-32 bg-green-500/20 rounded-full blur-[40px] animate-pulse"></div>
             <div className="w-2 h-32 bg-gradient-to-t from-emerald-800 to-emerald-400 rounded-full"></div>
             <div className="absolute top-20 -left-6 w-8 h-8 bg-emerald-400 rounded-tr-[20px] rounded-bl-[20px] transform -rotate-12 animate-float"></div>
             <div className="absolute top-16 -right-6 w-10 h-10 bg-emerald-300 rounded-tl-[20px] rounded-br-[20px] transform rotate-12 animate-float"></div>
          </div>
        )}

        {level === 2 && (
          <div className="relative w-80 h-[500px] flex flex-col items-center justify-end animate-tree-sway origin-bottom mb-10 opacity-80">
             <div className="absolute bottom-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[60px] animate-pulse"></div>
             <div className="w-6 h-64 bg-gradient-to-t from-slate-700 to-slate-500 relative">
                <div className="absolute top-10 -left-16 w-20 h-2 bg-slate-600 rotate-[-25deg] rounded-full"></div>
                <div className="absolute top-24 -right-14 w-16 h-2 bg-slate-600 rotate-[25deg] rounded-full"></div>
                <div className="absolute top-40 -left-10 w-12 h-2 bg-slate-600 rotate-[-15deg] rounded-full"></div>
             </div>
             <div className="absolute top-0 w-64 h-64 opacity-80">
                <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-900/50 rounded-full blur-md"></div>
                <div className="absolute top-0 right-10 w-40 h-40 bg-purple-900/50 rounded-full blur-md"></div>
             </div>
          </div>
        )}

        {level === 3 && (
          <div className="relative w-full max-w-lg h-[90%] flex flex-col items-center justify-end animate-glow-pulse origin-bottom opacity-90">
             <div className="absolute bottom-0 w-[500px] h-[300px] bg-gradient-to-t from-purple-900/40 to-transparent rounded-full blur-[80px]"></div>
             <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-[0_0_10px_rgba(167,139,250,0.5)]">
                <defs>
                   <linearGradient id="treeGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#4c1d95" />
                      <stop offset="50%" stopColor="#a78bfa" />
                      <stop offset="100%" stopColor="#fff" />
                   </linearGradient>
                </defs>
                <g className="animate-tree-sway origin-bottom">
                  <path d="M100 300 L100 200" stroke="url(#treeGrad)" strokeWidth="8" strokeLinecap="round" />
                  <path d="M100 200 Q 80 150 60 120" stroke="url(#treeGrad)" strokeWidth="6" fill="none" />
                  <path d="M100 200 Q 120 150 140 120" stroke="url(#treeGrad)" strokeWidth="6" fill="none" />
                  <path d="M60 120 Q 40 80 30 60" stroke="url(#treeGrad)" strokeWidth="4" fill="none" />
                  <path d="M60 120 Q 80 90 90 70" stroke="url(#treeGrad)" strokeWidth="4" fill="none" />
                  <path d="M140 120 Q 120 90 110 70" stroke="url(#treeGrad)" strokeWidth="4" fill="none" />
                  <path d="M140 120 Q 160 80 170 60" stroke="url(#treeGrad)" strokeWidth="4" fill="none" />
                  <path d="M30 60 L 20 40" stroke="white" strokeWidth="2" opacity="0.6" />
                  <path d="M170 60 L 180 40" stroke="white" strokeWidth="2" opacity="0.6" />
                </g>
             </svg>
             <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                   <div key={i} className="absolute animate-float-random" style={{top: Math.random()*80+'%', left: Math.random()*100+'%', animationDuration: Math.random()*5+5+'s'}}>
                      <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDuration: Math.random()*2+1+'s'}} />
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* === CRYSTAL BALLS (Ornaments) === */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
           <div className="relative w-full h-full max-w-lg mx-auto">
             {ornaments.map((item, i) => (
                <div
                   key={item.id}
                   className="absolute transition-all duration-1000 ease-in-out"
                   style={{
                     top: item.top,
                     left: item.left,
                   }}
                >
                  <button
                    onClick={() => handleBallClick(item)}
                    className={`
                      relative pointer-events-auto cursor-pointer group
                      w-14 h-14 rounded-full 
                      backdrop-blur-md bg-white/10
                      border-2 ${item.theme.border}
                      shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]
                      ${item.theme.glow}
                      hover:scale-125 transition-transform duration-300
                      animate-float overflow-hidden
                    `}
                    style={{
                      animationDelay: `${item.delay}ms`,
                      animationDuration: '6s'
                    }}
                  >
                     {/* 1. Content Layer: Image or Nebula */}
                     {item.content?.imageFile ? (
                       <img src={item.content.imageFile} alt="Memory" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                     ) : (
                       <div className={`w-full h-full bg-gradient-to-br ${item.theme.nebula} opacity-60 group-hover:opacity-80 transition-opacity animate-spin-slow`} style={{animationDuration: '10s'}}></div>
                     )}

                     {/* 2. Glass Shine Effect */}
                     <div className="absolute top-1 left-2 w-5 h-3 bg-white/40 rounded-full transform -rotate-45 blur-[1px]"></div>
                     <div className="absolute bottom-1 right-2 w-3 h-3 bg-white/20 rounded-full blur-[2px]"></div>

                     {/* 3. Recharge Effect */}
                     {rechargeId === item.id && (
                       <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-full h-full bg-white rounded-full animate-ping opacity-75"></div>
                         <Zap size={20} className="text-white z-20 animate-bounce absolute" />
                       </div>
                     )}

                     {/* 4. Rank/Click Indicator */}
                     {(item.stats?.clickCount || 0) > 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full text-[8px] flex items-center justify-center text-black font-bold shadow-lg">
                          {item.stats.clickCount}
                        </div>
                     )}
                  </button>
                  
                  {/* Connection Line to Tree */}
                  <div className="absolute -top-10 left-1/2 w-px h-10 bg-white/20 -z-10 origin-bottom transform group-hover:scale-y-0 transition-transform"></div>
                </div>
             ))}
           </div>
        </div>
      </div>

      <div className="pb-10 text-center z-10">
         <h2 className="text-2xl font-serif text-white/90 tracking-widest drop-shadow-md">信念树</h2>
         <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] mt-1">Belief Tree</p>
      </div>

      {selectedEntry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-fade-in">
           <div className="relative w-full max-w-sm aspect-[3/4] rounded-xl overflow-hidden shadow-2xl animate-zoom-forward" style={{ animationDuration: '0.3s', animationIterationCount: 1, animationFillMode: 'forwards' }}>
              <button 
                onClick={() => setSelectedEntry(null)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/40 rounded-full text-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
              <CalendarView text={selectedEntry.content.insightText} />
           </div>
        </div>
      )}

    </div>
  );
};

export default BeliefTree;
