
import React, { useState, useRef, useEffect } from 'react';
import { MoodType, HappinessSource, UserTraits, StrengthDetail } from '../types';
import { STRENGTHS_DATA } from '../data/strengths';
import { ArrowLeft, Gift, Heart, Mic, Image as ImageIcon, X, Sparkles, Wand2, ChevronRight, Quote, Zap, Clock, PieChart, Shield, Sprout, ArrowDown, Brain } from 'lucide-react';
import StrengthPicker from './StrengthPicker';
import { StorageService } from '../services/storageService';

interface Props {
  mood: MoodType;
  onBack: () => void;
}

// Combined Steps Enum
enum InputStep {
  CAPTURE,       // Step 1: Capture (Common but branched UI)
  
  // Positive Flow
  ATTRIBUTION,   
  LINKING,       
  PREVIEW,       
  CRYSTALLIZE,    

  // Negative Flow (Resilience Lab)
  LAB_PERMANENCE, // Time Slider
  LAB_PERVASIVENESS, // Life Pizza
  LAB_PERSONALIZATION, // Responsibility Pie
  LAB_ENERGIZATION, // Summary/Insight
  LAB_BURIAL // Burial Animation
}

// --- SUB-COMPONENT: Psychology Label ---
// Updated: Now a static card in the flow, not a popup
const PsychologyLabel: React.FC<{ title: string; content: string; color?: string }> = ({ title, content, color = "text-indigo-300" }) => {
  return (
    <div className="w-full relative z-20 animate-fade-in mb-4">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex gap-3 items-start shadow-sm">
        <div className={`mt-0.5 p-1.5 rounded-full bg-white/10 shrink-0 ${color}`}>
          <Brain size={16} />
        </div>
        <div className="flex-1">
           <span className={`text-[10px] font-bold uppercase tracking-widest block mb-1 ${color}`}>{title}</span>
           <p className="text-xs text-slate-300 leading-relaxed text-left font-light opacity-90">
             {content}
           </p>
        </div>
      </div>
    </div>
  );
};

const MoodInput: React.FC<Props> = ({ mood, onBack }) => {
  const [step, setStep] = useState<InputStep>(InputStep.CAPTURE);
  
  // --- Data State ---
  const [eventText, setEventText] = useState('');     
  const [insightText, setInsightText] = useState(''); 
  const [imageFile, setImageFile] = useState<string | null>(null);
  
  // UI State
  const [source, setSource] = useState<HappinessSource | null>(null);
  const [isCrystalAnimating, setIsCrystalAnimating] = useState(false);
  const [showEndText, setShowEndText] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  // Ticker State
  const [tickerIndex, setTickerIndex] = useState(0);
  const [availableTemplates, setAvailableTemplates] = useState<{text: string, strengthName: string, id: string}[]>([]);
  
  // User Data
  const [userTraits, setUserTraits] = useState<UserTraits | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  // --- LAB STATE (Negative Flow) ---
  const [timeValue, setTimeValue] = useState(0); // 0 to 100
  const [affectedAreas, setAffectedAreas] = useState<string[]>([]);
  const [responsibilityMe, setResponsibilityMe] = useState(100);
  const [externalFactors, setExternalFactors] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const isPositive = mood === MoodType.EUPHORIC || mood === MoodType.STABLE;

  // Init Data
  useEffect(() => {
    if (isPositive) {
      const stored = localStorage.getItem('user_traits');
      if (stored) {
        setUserTraits(JSON.parse(stored));
      } else {
        setShowPicker(true);
      }
    }
  }, [isPositive]);

  // Generate Ticker Templates (Positive only)
  useEffect(() => {
    if (step === InputStep.LINKING && source) {
      let candidates: StrengthDetail[] = [];
      
      if (source === HappinessSource.INTERNAL) {
        if (userTraits && userTraits.strengths.length > 0) {
           candidates = STRENGTHS_DATA.filter(s => userTraits.strengths.includes(s.id));
        } else {
           candidates = STRENGTHS_DATA.filter(s => ['勇气', '智慧'].includes(s.category));
        }
      } else {
         const externalIds = ['appreciation', 'gratitude', 'curiosity', 'love', 'hope', 'spirituality'];
         candidates = STRENGTHS_DATA.filter(s => externalIds.includes(s.id));
      }

      const tmpls = candidates
        .map(s => {
          const text = source === HappinessSource.INTERNAL ? s.templates?.internal : s.templates?.external;
          return text ? { text, strengthName: s.name, id: s.id } : null;
        })
        .filter((t): t is {text: string, strengthName: string, id: string} => t !== null);

      setAvailableTemplates(tmpls);
      setTickerIndex(0);
    }
  }, [step, source, userTraits]);

  // Ticker Timer
  useEffect(() => {
    if (step !== InputStep.LINKING || availableTemplates.length === 0) return;
    const timer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % availableTemplates.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [step, availableTemplates]);

  // Animation Logics
  useEffect(() => {
    // Crystal (Positive)
    if (step === InputStep.CRYSTALLIZE) {
      setIsCrystalAnimating(true);
      const textTimer = setTimeout(() => setShowEndText(true), 1500);
      const fadeTimer = setTimeout(() => setIsFadingOut(true), 4500);
      const endTimer = setTimeout(() => onBack(), 5500);
      return () => { clearTimeout(textTimer); clearTimeout(fadeTimer); clearTimeout(endTimer); };
    }
    // Burial (Negative)
    if (step === InputStep.LAB_BURIAL) {
      setIsCrystalAnimating(true);
      const textTimer = setTimeout(() => setShowEndText(true), 2000); // Slower for burial
      const fadeTimer = setTimeout(() => setIsFadingOut(true), 5000);
      const endTimer = setTimeout(() => onBack(), 6000);
      return () => { clearTimeout(textTimer); clearTimeout(fadeTimer); clearTimeout(endTimer); };
    }
  }, [step, onBack]);

  const handleTraitsComplete = (traits: UserTraits) => {
    localStorage.setItem('user_traits', JSON.stringify(traits));
    setUserTraits(traits);
    setShowPicker(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextFromCapture = () => {
    if (!eventText.trim() && !imageFile && isPositive) return; // Positive needs something
    if (!eventText.trim() && !isPositive) return; // Negative needs text
    
    if (isPositive) {
      setStep(InputStep.ATTRIBUTION);
    } else {
      setStep(InputStep.LAB_PERMANENCE);
    }
  };

  const handleBack = () => {
    if (step === InputStep.CAPTURE) {
      onBack();
    } else {
      setStep(prev => prev - 1);
    }
  };

  const handleSourceSelect = (selectedSource: HappinessSource) => {
    setSource(selectedSource);
    setStep(InputStep.LINKING);
  };

  const applyTemplate = () => {
    const current = availableTemplates[tickerIndex];
    if (!current) return;
    setInsightText(current.text); 
  };

  const handleInjectPower = async () => {
    await StorageService.createEntry({
      mood,
      eventText,
      source,
      insightText,
      imageFile
    });
    
    if (isPositive) {
      setStep(InputStep.CRYSTALLIZE);
    } else {
      setStep(InputStep.LAB_BURIAL);
    }
  };

  // --- Lab Logic ---
  const handleToggleArea = (area: string) => {
    if (affectedAreas.includes(area)) {
      setAffectedAreas(prev => prev.filter(a => a !== area));
    } else {
      setAffectedAreas(prev => [...prev, area]);
    }
  };

  const handleAddFactor = (factor: string) => {
    if (externalFactors.includes(factor)) return;
    setExternalFactors(prev => [...prev, factor]);
    setResponsibilityMe(prev => Math.max(10, prev - 20)); // Reduce but min 10%
  };

  const generateLabInsight = () => {
    const timeFrame = timeValue > 90 ? "十年" : timeValue > 60 ? "一年" : timeValue > 30 ? "下个月" : "下周";
    const factors = externalFactors.length > 0 ? `，且受到${externalFactors.join('、')}的影响` : "";
    const safeAreas = ["健康", "家庭", "工作", "社交", "爱好", "自我"].filter(a => !affectedAreas.includes(a));
    const shine = safeAreas.length > 0 ? `。虽然有些糟糕，但我的${safeAreas.slice(0,2).join('和')}依然安好` : "";
    
    const summary = `虽然发生了"${eventText}"，但在${timeFrame}后的维度看，它终将淡去${factors}${shine}。我允许这份情绪经过我，并转化为成长的养分。`;
    setInsightText(summary);
    setStep(InputStep.LAB_ENERGIZATION);
  };

  // Helper for Time Scroll Date Calculation
  const getFutureDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  // Helper for Time Scroll Content
  const getTimeContext = (val: number) => {
    if (val < 15) return { 
        label: "NOW", 
        date: "今天", 
        question: "它现在看起来像一块巨石吗？", 
        opacity: 1, blur: 0, scale: 1 
    };
    if (val < 45) return { 
        label: "+1 WEEK", 
        date: getFutureDate(7), 
        question: "下周的今天，这件事还会刺痛你吗？", 
        opacity: 0.9, blur: 1, scale: 0.95 
    };
    if (val < 75) return { 
        label: "+1 MONTH", 
        date: getFutureDate(30), 
        question: "下个月的这一天，它会影响你吃早餐的心情吗？", 
        opacity: 0.7, blur: 3, scale: 0.8 
    };
    if (val < 95) return { 
        label: "+1 YEAR", 
        date: getFutureDate(365), 
        question: "一年后的今天，这件事会改变你的人生轨迹吗？", 
        opacity: 0.4, blur: 5, scale: 0.6 
    };
    return { 
        label: "+10 YEARS", 
        date: getFutureDate(3650), 
        question: "十年后回望，这只是你漫长人生故事里的一行注脚。", 
        opacity: 0.1, blur: 10, scale: 0.4 
    };
  };

  const timeContext = getTimeContext(timeValue);

  // UI Helpers
  const getContainerBg = () => {
    if (step === InputStep.CRYSTALLIZE || step === InputStep.LAB_BURIAL) return 'bg-slate-950';
    if (step === InputStep.PREVIEW || step === InputStep.LAB_ENERGIZATION) return 'bg-slate-900';

    switch (mood) {
      case MoodType.EUPHORIC: return 'from-sky-100 to-white';
      case MoodType.STABLE: return 'from-amber-50 to-emerald-50';
      case MoodType.DEPRESSED: 
        // Lab Step 2 (Time) background transition
        if (step === InputStep.LAB_PERMANENCE) {
            const lightness = 10 + (timeValue / 100) * 15; // 10% to 25% lightness
            return `bg-slate-900`; // We handle dynamic bg via style in render
        }
        return 'from-slate-900 via-slate-800 to-black';
      default: return 'from-white to-slate-100';
    }
  };

  const isDarkTheme = mood === MoodType.DEPRESSED || step === InputStep.CRYSTALLIZE || step === InputStep.PREVIEW || !isPositive;
  const textColor = isDarkTheme ? 'text-white' : 'text-slate-800';
  const subTextColor = isDarkTheme ? 'text-white/60' : 'text-slate-500';
  const cardBg = isDarkTheme ? 'bg-white/10 border-white/10' : 'bg-white/60 border-white';

  // --- COMPONENT RENDER ---

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col bg-gradient-to-b ${getContainerBg()} transition-all duration-700 overflow-hidden ${isFadingOut ? 'opacity-0 duration-1000' : 'opacity-100'}`}
      style={step === InputStep.LAB_PERMANENCE ? {
        background: `linear-gradient(to right, rgb(15, 23, 42), rgb(${30 + timeValue}, ${41 + timeValue}, ${59 + timeValue}))` 
      } : {}}
    >
      
      {showPicker ? (
        <StrengthPicker onComplete={handleTraitsComplete} onBack={onBack} />
      ) : (
        <div className="flex flex-col w-full h-full overflow-hidden">
          
          {/* Header */}
          {step !== InputStep.CRYSTALLIZE && step !== InputStep.LAB_BURIAL && (
            <div className={`relative p-4 flex items-center justify-between z-30 ${textColor}`}>
              <button 
                onClick={handleBack} 
                className={`p-2 rounded-full transition-colors ${isDarkTheme ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-slate-800'}`}
              >
                <ArrowLeft size={24} />
              </button>
              
              {/* Context Title */}
              <div className="flex flex-col items-center">
                <span className={`text-[10px] tracking-[0.2em] uppercase font-bold opacity-40`}>
                  {step === InputStep.CAPTURE ? (isPositive ? "捕捉瞬间" : "采集样本") : 
                   step === InputStep.LAB_PERMANENCE ? "时间透视" :
                   step === InputStep.LAB_PERVASIVENESS ? "影响边界" :
                   step === InputStep.LAB_PERSONALIZATION ? "责任归因" :
                   step === InputStep.LAB_ENERGIZATION ? "能量转化" :
                   "能量配方"}
                </span>
                <div className={`h-1 w-6 rounded-full mt-1 ${isDarkTheme ? 'bg-indigo-400' : 'bg-indigo-600'}`}></div>
              </div>
              <div className="w-10"></div>
            </div>
          )}

          <div className="flex-1 relative overflow-y-auto no-scrollbar">
            <div className="min-h-full flex flex-col">
              
              {/* === COMMON STEP 1: CAPTURE === */}
              {step === InputStep.CAPTURE && (
                <div className="flex-1 flex flex-col p-5 animate-fade-in space-y-2 max-w-md mx-auto w-full relative">
                  
                  {/* Psychology Label for Negative Flow */}
                  {!isPositive && (
                    <PsychologyLabel 
                      title="CBT · 现实检验" 
                      content="痛苦往往源于我们对自己讲的那个“糟糕的故事”，而非事实本身。去除形容词，强制调动大脑的前额叶皮层 (PFC) 介入，能让你的理性回归，瞬间降低情绪浓度。"
                    />
                  )}

                  <div className="space-y-1 mt-2 z-10 relative">
                     <h3 className={`text-xl font-medium leading-relaxed ${textColor}`}>
                        {isPositive ? "告诉我，" : "采集逆境样本"}
                     </h3>
                     <h3 className={`text-2xl font-bold ${isPositive ? 'text-indigo-600' : 'text-blue-200'}`}>
                        {isPositive ? "此刻是什么在发光？" : "如果不使用形容词..."}
                     </h3>
                     {!isPositive && <p className="text-white/50 text-sm mt-2">摄像机拍到了什么？</p>}
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-3 min-h-[140px] mt-4">
                    <textarea
                      value={eventText}
                      onChange={(e) => setEventText(e.target.value)}
                      placeholder={isPositive 
                        ? "看见了晚霞？完成了一个挑战？..." 
                        : "例如：不是“他无情地拒绝了我”，而是“他说现在不方便”。\n客观描述发生了什么，不带形容词。"}
                      className={`w-full flex-1 p-4 rounded-2xl text-base border transition-all resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300/50 shadow-sm
                        ${isDarkTheme 
                          ? 'bg-white/5 text-white border-white/20 placeholder:text-white/30' 
                          : 'bg-white text-slate-800 border-indigo-100 placeholder:text-slate-400'
                        }`}
                    />
                    
                    {/* Image Upload - ONLY for Positive Flow */}
                    {isPositive && (
                      <div className="relative z-10 flex items-center gap-3">
                        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className={`p-3 rounded-2xl flex items-center gap-2 transition-all shadow-sm flex-1 justify-center border ${imageFile ? 'bg-indigo-600 text-white border-indigo-600' : (isDarkTheme ? 'bg-white/10 text-white border-white/10' : 'bg-white text-slate-600 border-indigo-50')}`}
                        >
                          <ImageIcon size={18} />
                          <span className="text-sm font-medium">{imageFile ? "已添加" : "添加图片"}</span>
                        </button>
                      </div>
                    )}
                    
                    {imageFile && isPositive && (
                      <div className="relative w-full h-32 rounded-2xl overflow-hidden border-2 border-white shadow-lg animate-fade-in-up">
                        <img src={imageFile} className="w-full h-full object-cover" alt="Preview" />
                        <button onClick={() => setImageFile(null)} className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full">
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 pb-6">
                    <button
                      disabled={!eventText.trim() && !imageFile}
                      onClick={handleNextFromCapture}
                      className={`w-full py-4 rounded-[20px] font-bold text-lg shadow-xl active:scale-[0.98] transition-all disabled:opacity-20 disabled:grayscale ${isDarkTheme ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}
                    >
                      {isPositive ? "下一步" : "进入实验室"}
                    </button>
                  </div>
                </div>
              )}

              {/* === NEGATIVE FLOW: RESILIENCE LAB === */}
              
              {/* LAB STEP 1: PERMANENCE (Time Scroll) */}
              {step === InputStep.LAB_PERMANENCE && (
                <div className="flex-1 flex flex-col p-6 animate-fade-in items-center justify-start max-w-md mx-auto w-full relative">
                   <PsychologyLabel 
                      title="时间心理学 · 心理距离" 
                      content="当我们将当下的烦恼置于长远的时间维度中（Temporal Distancing），大脑会重新评估其重要性。具体的日期能激活具象思维，打破“痛苦将永恒持续”的错觉。"
                    />

                   <div className="text-center mb-6 z-10 mt-2">
                      <Clock size={32} className="mx-auto text-blue-300 mb-2 opacity-80" />
                      <h3 className="text-lg font-light text-white">时光卷轴</h3>
                   </div>

                   {/* Dynamic Question */}
                   <div className="w-full px-6 text-center mb-6">
                      <p className="text-blue-200/80 text-sm font-medium tracking-wide animate-pulse">
                         {timeContext.question}
                      </p>
                   </div>

                   {/* Text that fades/blurs/scales */}
                   <div className="relative w-full h-48 flex items-center justify-center mb-10 px-4 shrink-0">
                      <p 
                        className="text-2xl font-serif text-white text-center transition-all duration-500 ease-out break-words line-clamp-4"
                        style={{ 
                          opacity: timeContext.opacity,
                          filter: `blur(${timeContext.blur}px)`,
                          transform: `scale(${timeContext.scale})`
                        }}
                      >
                        "{eventText}"
                      </p>
                   </div>

                   {/* Custom Scroll Input */}
                   <div className="w-full space-y-6 z-10 mt-auto">
                      {/* Date Indicator */}
                      <div className="text-center">
                         <span className="text-[10px] text-blue-300/50 uppercase tracking-widest mb-1 block">
                           {timeContext.label}
                         </span>
                         <span className="text-3xl font-mono text-white font-bold tracking-tight">
                           {timeContext.date}
                         </span>
                      </div>

                      <div className="relative h-12 w-full flex items-center">
                        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-slate-700 via-blue-900 to-sky-900 rounded-full"></div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={timeValue} 
                          onChange={(e) => setTimeValue(Number(e.target.value))}
                          className="w-full absolute z-20 h-12 opacity-0 cursor-pointer"
                        />
                        <div 
                          className="absolute w-6 h-6 bg-white rounded-full shadow-[0_0_15px_white] pointer-events-none transition-all duration-75 ease-out flex items-center justify-center"
                          style={{ left: `calc(${timeValue}% - 12px)` }}
                        >
                           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        </div>
                        {/* Ticks */}
                        {[0, 25, 50, 75, 100].map(tick => (
                           <div key={tick} className="absolute w-0.5 h-2 bg-white/20" style={{ left: `${tick}%` }}></div>
                        ))}
                      </div>
                   </div>

                   <button onClick={() => setStep(InputStep.LAB_PERVASIVENESS)} className="mt-8 w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-[20px] font-bold transition-all border border-white/10 shrink-0">
                      看见未来，下一步
                   </button>
                </div>
              )}

              {/* LAB STEP 2: PERVASIVENESS (Pizza) */}
              {step === InputStep.LAB_PERVASIVENESS && (
                <div className="flex-1 flex flex-col p-6 animate-fade-in items-center justify-between max-w-md mx-auto w-full relative">
                   <div className="w-full">
                      <PsychologyLabel 
                          title="积极心理学 · 普遍性破解" 
                          content="烦恼往往会让我们产生“我的人生全毁了”的错觉。实际上，它只是生活的一个切面。点亮那些安好的区域，重建掌控感。"
                      />
                      <div className="text-center pt-2">
                          <PieChart size={32} className="mx-auto text-blue-300 mb-2 opacity-80" />
                          <h3 className="text-lg font-light text-white">它影响了什么？</h3>
                          <p className="text-xs text-white/50 mt-1">点击变灰的区域，保留光亮的区域</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-3 w-full max-w-[300px]">
                      {["健康", "家庭", "工作", "社交", "爱好", "自我"].map(area => {
                         const isAffected = affectedAreas.includes(area);
                         return (
                           <button
                             key={area}
                             onClick={() => handleToggleArea(area)}
                             className={`h-24 rounded-2xl flex flex-col items-center justify-center transition-all duration-500 border
                               ${isAffected 
                                 ? 'bg-slate-800 border-slate-700 text-slate-500 grayscale scale-95' 
                                 : 'bg-indigo-900/40 border-indigo-400/50 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.3)] animate-pulse'
                               }`}
                           >
                              <span className="font-bold">{area}</span>
                           </button>
                         )
                      })}
                   </div>

                   <button onClick={() => setStep(InputStep.LAB_PERSONALIZATION)} className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-[20px] font-bold transition-all border border-white/10">
                      保留光亮，下一步
                   </button>
                </div>
              )}

              {/* LAB STEP 3: PERSONALIZATION (Pie) */}
              {step === InputStep.LAB_PERSONALIZATION && (
                <div className="flex-1 flex flex-col p-6 animate-fade-in items-center max-w-md mx-auto w-full relative">
                   <PsychologyLabel 
                      title="CBT · 归因风格" 
                      content="抑郁情绪常伴随着过度的“内部归因”（都是我的错）。客观识别外部因素，能卸下不属于你的心理重担。"
                   />

                   <div className="text-center mb-6 pt-2">
                      <Shield size={32} className="mx-auto text-blue-300 mb-2 opacity-80" />
                      <h3 className="text-lg font-light text-white">是谁的责任？</h3>
                      <p className="text-xs text-white/50 mt-1">添加外部因素，减轻自我负担</p>
                   </div>

                   {/* Visual Pie */}
                   <div className="w-48 h-48 rounded-full bg-slate-800 relative overflow-hidden mb-8 border-4 border-slate-700">
                      <div 
                        className="absolute inset-0 bg-red-500/80 transition-all duration-700 ease-out"
                        style={{ clipPath: `polygon(0 0, 100% 0, 100% ${responsibilityMe}%, 0 ${responsibilityMe}%)` }} 
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                         <span className="font-black text-2xl text-white drop-shadow-md">{responsibilityMe}%</span>
                      </div>
                      <div className="absolute bottom-2 w-full text-center text-[10px] text-white/80 font-bold uppercase">我的责任</div>
                   </div>

                   <div className="flex flex-wrap gap-2 justify-center w-full mb-8">
                      {["运气不好", "环境因素", "他人疏忽", "不可抗力"].map(factor => (
                        <button 
                          key={factor}
                          onClick={() => handleAddFactor(factor)}
                          className={`px-4 py-2 border rounded-full text-xs transition-all active:scale-95 ${externalFactors.includes(factor) ? 'bg-slate-600 border-slate-500 text-white' : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-300'}`}
                        >
                          + {factor}
                        </button>
                      ))}
                   </div>
                   
                   <button onClick={generateLabInsight} className="mt-auto w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-[20px] font-bold transition-all border border-white/10">
                      重新定义，下一步
                   </button>
                </div>
              )}

              {/* LAB STEP 4: ENERGIZATION (Insight) */}
              {step === InputStep.LAB_ENERGIZATION && (
                <div className="flex-1 flex flex-col p-6 animate-fade-in items-center justify-center max-w-md mx-auto w-full">
                   <div className="text-center mb-6">
                      <Sprout size={32} className="mx-auto text-amber-400 mb-2" />
                      <h3 className="text-xl font-light text-white">能量重构</h3>
                   </div>
                   
                   <div className="w-full bg-white/5 p-6 rounded-2xl border border-white/10 mb-6 relative">
                      <textarea
                         value={insightText}
                         onChange={(e) => setInsightText(e.target.value)}
                         className="w-full h-40 bg-transparent text-white text-base font-serif leading-loose resize-none focus:outline-none"
                      />
                      <div className="absolute bottom-4 right-4 text-xs text-white/30">点击编辑</div>
                   </div>

                   <button onClick={handleInjectPower} className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-[20px] font-bold shadow-[0_0_30px_rgba(217,119,6,0.4)] transition-all flex items-center justify-center gap-2 animate-pulse">
                      <ArrowDown size={20} />
                      转化为养分
                   </button>
                </div>
              )}

              {/* LAB STEP 5: BURIAL */}
              {step === InputStep.LAB_BURIAL && (
                 <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center overflow-hidden">
                    
                    {/* Soil Layers */}
                    <div className={`absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-stone-900 to-transparent transition-opacity duration-1000 ${isCrystalAnimating ? 'opacity-100' : 'opacity-0'}`}></div>

                    {/* The Amber */}
                    <div className={`relative w-40 h-48 transition-all duration-[3000ms] ease-in-out ${isCrystalAnimating ? 'translate-y-[40vh] scale-75' : '-translate-y-20'}`}>
                       <div className="w-full h-full bg-gradient-to-br from-amber-600 to-yellow-900 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] shadow-[0_0_60px_rgba(217,119,6,0.5)] flex items-center justify-center border-4 border-amber-900/30 animate-pulse">
                          <div className="text-white/20 font-serif text-4xl">?</div>
                       </div>
                    </div>

                    <div className={`absolute top-1/2 w-full text-center transition-all duration-1000 delay-1000 ${showEndText ? 'opacity-100' : 'opacity-0'}`}>
                       <h2 className="text-2xl text-amber-100/80 font-serif tracking-widest mb-2">已埋入土壤</h2>
                       <p className="text-stone-500 text-sm">它将成为成长的养分</p>
                    </div>
                 </div>
              )}


              {/* === POSITIVE FLOW STEPS (Keeping existing logic) === */}
              {step === InputStep.ATTRIBUTION && (
                <div className="relative flex-1 min-h-full flex flex-col p-5 animate-fade-in max-w-md mx-auto w-full">
                  <div className="flex-1 flex flex-col justify-center items-center space-y-6">
                     <div className="text-center space-y-1">
                        <h3 className={`text-2xl font-light ${textColor}`}>这份光芒...</h3>
                        <p className={`text-xs tracking-widest uppercase ${subTextColor}`}>来自何处？</p>
                     </div>

                     <div className="w-full grid grid-cols-1 gap-4">
                       <button 
                        onClick={() => handleSourceSelect(HappinessSource.INTERNAL)}
                        className={`group relative flex items-center gap-4 p-5 backdrop-blur-md rounded-[24px] border-2 transition-all active:scale-95 text-left shadow-sm hover:shadow-md hover:border-indigo-300 ${cardBg}`}
                       >
                         <div className="p-4 bg-amber-100 text-amber-500 rounded-full group-hover:scale-110 transition-transform"><Heart size={28} /></div>
                         <div>
                           <h4 className={`text-lg font-bold mb-0.5 ${isDarkTheme ? 'text-white' : 'text-slate-800'}`}>内在的力量</h4>
                           <p className={`text-[11px] ${isDarkTheme ? 'text-white/60' : 'text-slate-500'}`}>是我让这件事发生的 / 我掌控了局面</p>
                         </div>
                       </button>

                       <button 
                        onClick={() => handleSourceSelect(HappinessSource.EXTERNAL)}
                        className={`group relative flex items-center gap-4 p-5 backdrop-blur-md rounded-[24px] border-2 transition-all active:scale-95 text-left shadow-sm hover:shadow-md hover:border-pink-300 ${cardBg}`}
                       >
                         <div className="p-4 bg-pink-100 text-pink-500 rounded-full group-hover:scale-110 transition-transform"><Gift size={28} /></div>
                         <div>
                           <h4 className={`text-lg font-bold mb-0.5 ${isDarkTheme ? 'text-white' : 'text-slate-800'}`}>世界的馈赠</h4>
                           <p className={`text-[11px] ${isDarkTheme ? 'text-white/60' : 'text-slate-500'}`}>我遇见了美好 / 我是被爱的</p>
                         </div>
                       </button>
                     </div>
                  </div>
                </div>
              )}

              {step === InputStep.LINKING && (
                <div className="flex-1 flex flex-col p-5 animate-fade-in space-y-4 max-w-md mx-auto w-full">
                   {/* Context */}
                   <div className={`relative p-4 rounded-xl flex items-start gap-3 opacity-90 scale-95 origin-top border ${isDarkTheme ? 'bg-white/10 border-white/10' : 'bg-white/40 border-white'}`}>
                      <Quote size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                      <p className={`text-xs italic line-clamp-2 leading-relaxed ${isDarkTheme ? 'text-white/80' : 'text-slate-700'}`}>
                        {eventText || "[图片记录]"}
                      </p>
                   </div>

                   <div className="space-y-1">
                     <h3 className={`text-xl font-light leading-snug ${textColor}`}>
                       你感受到了什么力量？
                     </h3>
                     <p className={`text-xs opacity-60 ${textColor}`}>点击灵感条，或写下你的答案</p>
                   </div>

                   {/* Ticker */}
                   <div className="relative h-20 w-full mb-1">
                     {availableTemplates.length > 0 ? (
                       <button 
                         onClick={applyTemplate}
                         className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-50/90 to-purple-50/90 backdrop-blur-sm border-2 border-indigo-100 rounded-2xl flex items-center justify-between px-5 shadow-sm hover:shadow-md transition-all group overflow-hidden"
                       >
                         <div className="flex items-center gap-3 flex-1 overflow-hidden text-left">
                           <div className="p-2 bg-white rounded-full shadow-sm text-indigo-500 shrink-0">
                             <Wand2 size={18} className="animate-pulse" />
                           </div>
                           <div className="flex flex-col items-start overflow-hidden gap-0.5">
                              <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                {availableTemplates[tickerIndex].strengthName}
                              </span>
                              <p key={tickerIndex} className="text-slate-800 text-xs font-medium leading-tight line-clamp-2 animate-fade-in-up">
                                {availableTemplates[tickerIndex].text}
                              </p>
                           </div>
                         </div>
                         <ChevronRight size={18} className="text-indigo-300 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                         <div key={`progress-${tickerIndex}`} className="absolute bottom-0 left-0 h-1 bg-indigo-400/20 w-full">
                           <div className="h-full bg-indigo-400 w-full animate-[width_4s_linear] origin-left"></div>
                         </div>
                       </button>
                     ) : (
                       <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
                         暂无推荐模版
                       </div>
                     )}
                   </div>

                   {/* Editor */}
                   <div className="flex-1 relative">
                     <textarea
                       ref={textAreaRef}
                       value={insightText}
                       onChange={(e) => setInsightText(e.target.value)}
                       placeholder="写下你的感受..."
                       className={`w-full h-full rounded-[24px] p-5 text-base leading-relaxed border focus:outline-none focus:ring-2 focus:ring-indigo-300/50 resize-none shadow-sm transition-colors ${isDarkTheme ? 'bg-white/10 text-white border-white/10 placeholder:text-white/30' : 'bg-white text-slate-800 border-indigo-100 placeholder:text-slate-400'}`}
                     />
                   </div>

                   <button
                      disabled={!insightText.trim()}
                      onClick={() => setStep(InputStep.PREVIEW)}
                      className={`w-full py-4 rounded-[20px] font-bold text-lg shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale ${isDarkTheme ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}
                    >
                      <Sparkles size={18} className="text-yellow-400" />
                      预览能量
                    </button>
                </div>
              )}

              {step === InputStep.PREVIEW && (
                 <div className="flex-1 flex flex-col p-5 animate-fade-in text-white space-y-5 overflow-y-auto pb-32 max-w-md mx-auto w-full">
                    <div className="text-center space-y-1 pt-2">
                      <h3 className="text-xl font-light">能量配方已就绪</h3>
                      <p className="text-white/50 text-[10px] tracking-widest uppercase">The Formula</p>
                    </div>

                    <div className="flex-1 flex flex-col gap-0 items-center">
                      <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 relative z-10">
                         <span className="absolute -left-2 top-5 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg ring-4 ring-slate-900">1</span>
                         <p className="text-xs text-white/60 mb-1 font-bold uppercase tracking-wider">客观事实</p>
                         <p className="text-base leading-relaxed">{eventText}</p>
                         {imageFile && <img src={imageFile} className="mt-4 rounded-lg w-full h-32 object-cover opacity-80" alt="Event" />}
                      </div>

                      <div className="w-0.5 h-6 bg-white/10"></div>

                      <div className="w-full flex flex-col items-center justify-center py-2 relative z-20">
                        <div className={`p-3 rounded-full mb-2 ${source === HappinessSource.INTERNAL ? 'bg-amber-100 text-amber-500' : 'bg-pink-100 text-pink-500'} shadow-[0_0_20px_rgba(255,255,255,0.3)]`}>
                           {source === HappinessSource.INTERNAL ? <Heart size={20} /> : <Gift size={20} />}
                        </div>
                        <p className="text-base font-medium text-white text-center tracking-wide drop-shadow-md">
                          {source === HappinessSource.INTERNAL ? "我感受到了我自己的内在力量" : "我接受到了世界的馈赠"}
                        </p>
                      </div>

                      <div className="w-0.5 h-6 bg-white/10"></div>

                      <div className="w-full bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-md rounded-2xl p-5 border border-indigo-500/30 shadow-lg relative z-10">
                         <span className="absolute -left-2 top-5 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg ring-4 ring-slate-900">3</span>
                         <p className="text-xs text-purple-200 mb-1 font-bold uppercase tracking-wider">主观意义</p>
                         <p className="text-lg font-serif italic text-white leading-relaxed">"{insightText}"</p>
                         <div className="absolute top-4 right-4 text-white/10"><Sparkles size={32} /></div>
                      </div>
                    </div>

                    <button
                      onClick={handleInjectPower}
                      className="w-full py-4 mt-auto rounded-[20px] font-bold text-lg shadow-[0_0_40px_rgba(167,139,250,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 bg-white text-indigo-950 animate-pulse hover:animate-none"
                    >
                      <Zap size={20} className="fill-indigo-950" />
                      注入水晶球
                    </button>
                 </div>
              )}

              {step === InputStep.CRYSTALLIZE && (
                 <div className="fixed inset-0 z-[60] bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
                    <div className={`absolute top-1/2 left-1/2 w-4 h-4 -ml-2 -mt-2 bg-white rounded-full blur-[2px] shadow-[0_0_20px_white] z-20 ${isCrystalAnimating ? 'animate-converge-top' : 'opacity-0'}`}></div>
                    <div className={`absolute top-1/2 left-1/2 w-6 h-6 -ml-3 -mt-3 bg-amber-400 rounded-full blur-[4px] shadow-[0_0_30px_orange] z-20 ${isCrystalAnimating ? 'animate-converge-left' : 'opacity-0'}`}></div>
                    <div className={`absolute top-1/2 left-1/2 w-6 h-6 -ml-3 -mt-3 bg-purple-400 rounded-full blur-[4px] shadow-[0_0_30px_purple] z-20 ${isCrystalAnimating ? 'animate-converge-right' : 'opacity-0'}`}></div>

                    <div className="relative w-64 h-64 flex items-center justify-center z-10">
                       <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-[60px] animate-pulse"></div>
                       <div className="relative w-48 h-48 rounded-full bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/20 shadow-[inset_0_0_40px_rgba(255,255,255,0.1)] overflow-hidden animate-crystal-pulse">
                          <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(167,139,250,0.3)_90deg,transparent_180deg,rgba(59,130,246,0.3)_270deg,transparent_360deg)] animate-swirl opacity-50 blur-xl"></div>
                          <div className="absolute top-4 left-8 w-16 h-8 bg-white/20 rounded-full blur-xl transform -rotate-12"></div>
                       </div>
                    </div>

                    <div className={`mt-12 text-center transition-all duration-1000 ${showEndText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                       <h2 className="text-2xl text-white font-light tracking-widest mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">能量已注入</h2>
                       <div className="h-px w-20 bg-white/20 mx-auto my-4"></div>
                       <p className="text-indigo-200/80 text-sm">这份力量源泉已存储在【信念树】上</p>
                    </div>
                 </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodInput;
