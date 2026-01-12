
import React, { useState, useRef, useEffect } from 'react';
import { MoodType, HappinessSource, UserTraits, StrengthDetail } from '../types';
import { STRENGTHS_DATA } from '../data/strengths';
import { ArrowLeft, Gift, Heart, Mic, Image as ImageIcon, X, Sparkles, Wand2, ChevronRight, Quote, Zap } from 'lucide-react';
import StrengthPicker from './StrengthPicker';

interface Props {
  mood: MoodType;
  onBack: () => void;
}

enum InputStep {
  CAPTURE,       // Step 1: 纯粹记录事实 (Event)
  ATTRIBUTION,   // Step 2: 归因 (Internal vs External)
  LINKING,       // Step 3: 链接力量/升华 (Affirmation/Insight)
  PREVIEW,       // Step 4: 预览/咒语 (The Formula) - 新增
  CRYSTALLIZE    // Step 5: 结晶仪式 (Animation) - 新增
}

const MoodInput: React.FC<Props> = ({ mood, onBack }) => {
  const [step, setStep] = useState<InputStep>(InputStep.CAPTURE);
  
  // --- Data State ---
  const [eventText, setEventText] = useState('');     // Step 1: 发生了什么
  const [insightText, setInsightText] = useState(''); // Step 3: 这意味着什么
  const [imageFile, setImageFile] = useState<string | null>(null);
  
  // UI State
  const [source, setSource] = useState<HappinessSource | null>(null);
  const [isCrystalAnimating, setIsCrystalAnimating] = useState(false);
  const [showEndText, setShowEndText] = useState(false);
  
  // Ticker State
  const [tickerIndex, setTickerIndex] = useState(0);
  const [availableTemplates, setAvailableTemplates] = useState<{text: string, strengthName: string, id: string}[]>([]);
  
  // User Data
  const [userTraits, setUserTraits] = useState<UserTraits | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  
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

  // Generate Ticker Templates (Step 3 准备数据)
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

  // Crystal Ball Animation Logic
  useEffect(() => {
    if (step === InputStep.CRYSTALLIZE) {
      // 1. Start Particle Animation
      setIsCrystalAnimating(true);
      
      // 2. Show Text after particles converge (approx 1.5s)
      const textTimer = setTimeout(() => {
        setShowEndText(true);
      }, 1500);

      // 3. End Session after text displays (approx 4.5s total)
      const endTimer = setTimeout(() => {
        onBack();
      }, 4500);

      return () => {
        clearTimeout(textTimer);
        clearTimeout(endTimer);
      };
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

  const handleBack = () => {
    if (step === InputStep.CAPTURE) {
      onBack();
    } else {
      setStep(prev => prev - 1);
    }
  };

  const goToAttribution = () => {
    if (!eventText.trim() && !imageFile) return;
    setStep(InputStep.ATTRIBUTION);
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
  
  const goToPreview = () => {
    if (!insightText.trim()) return;
    setStep(InputStep.PREVIEW);
  };

  const handleInjectPower = () => {
    // 1. Save Data Immediately
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      mood,
      eventText,
      source,
      insightText,
      imageFile
    };
    
    // Simple LocalStorage Append
    const existing = localStorage.getItem('mood_entries');
    const entries = existing ? JSON.parse(existing) : [];
    entries.push(entry);
    localStorage.setItem('mood_entries', JSON.stringify(entries));

    // 2. Start Animation Step
    setStep(InputStep.CRYSTALLIZE);
  };

  // 统一背景色逻辑
  const getContainerBg = () => {
    if (step === InputStep.CRYSTALLIZE) return 'bg-slate-950'; // Deep dark for animation
    if (step === InputStep.PREVIEW) return 'bg-slate-900'; // Dark for preview magic

    switch (mood) {
      case MoodType.EUPHORIC: return 'from-sky-100 to-white';
      case MoodType.STABLE: return 'from-amber-50 to-emerald-50';
      case MoodType.DEPRESSED: return 'from-slate-900 to-slate-800';
      default: return 'from-white to-slate-100';
    }
  };

  const isDarkTheme = mood === MoodType.DEPRESSED || step === InputStep.CRYSTALLIZE || step === InputStep.PREVIEW;
  const textColor = isDarkTheme ? 'text-white' : 'text-slate-800';
  const subTextColor = isDarkTheme ? 'text-white/60' : 'text-slate-500';
  const cardBg = isDarkTheme ? 'bg-white/10 border-white/10' : 'bg-white/60 border-white';

  return (
    <div className={`fixed inset-0 z-50 flex flex-col bg-gradient-to-b ${getContainerBg()} transition-all duration-700 overflow-hidden`}>
      {showPicker && <StrengthPicker onComplete={handleTraitsComplete} />}
      
      {/* Header (Hidden in Crystallization Step) */}
      {step !== InputStep.CRYSTALLIZE && (
        <div className={`relative p-6 flex items-center justify-between z-30 ${textColor}`}>
          <button onClick={handleBack} className={`p-2 rounded-full transition-colors ${isDarkTheme ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col items-center">
            <span className={`text-[10px] tracking-[0.2em] uppercase font-bold opacity-40`}>
              {step === InputStep.CAPTURE ? "捕捉瞬间" : 
               step === InputStep.ATTRIBUTION ? "寻找源头" :
               step === InputStep.LINKING ? "确认力量" : "能量配方"}
            </span>
            <div className={`h-1 w-6 rounded-full mt-1 ${isDarkTheme ? 'bg-indigo-400' : 'bg-indigo-600'}`}></div>
          </div>
          <div className="w-10"></div>
        </div>
      )}

      <div className="flex-1 relative overflow-y-auto no-scrollbar">
        <div className="min-h-full flex flex-col">
          
          {/* STEP 1: CAPTURE */}
          {step === InputStep.CAPTURE && (
            <div className="flex-1 flex flex-col p-6 animate-fade-in space-y-6">
              <h3 className={`text-3xl font-light mt-2 leading-snug select-none ${textColor}`}>
                告诉我，<br/><span className="font-semibold text-indigo-600">此刻是什么在发光？</span>
              </h3>
              
              <div className="flex-1 flex flex-col gap-4 min-h-[300px]">
                <textarea
                  value={eventText}
                  onChange={(e) => setEventText(e.target.value)}
                  placeholder="看见了晚霞？完成了一个挑战？..." 
                  className={`relative z-10 w-full flex-1 min-h-[200px] backdrop-blur-md rounded-[32px] p-8 text-xl border-2 focus:outline-none focus:border-indigo-400 transition-all resize-none shadow-sm placeholder:text-slate-400 ${isDarkTheme ? 'bg-white/10 text-white border-white/20' : 'bg-white/60 text-slate-800 border-white'}`}
                />
                
                {/* Media Bar */}
                <div className="relative z-10 flex items-center gap-4">
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-4 rounded-2xl flex items-center gap-2 transition-all shadow-sm ${imageFile ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600'}`}
                  >
                    <ImageIcon size={20} />
                    <span className="text-sm font-medium">{imageFile ? "已添加" : "添加图片"}</span>
                  </button>
                  <button className="p-4 rounded-2xl bg-white text-slate-600 flex items-center gap-2 shadow-sm">
                    <Mic size={20} />
                    <span className="text-sm font-medium">语音</span>
                  </button>
                </div>
                
                {imageFile && (
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg animate-fade-in-up">
                    <img src={imageFile} className="w-full h-full object-cover" alt="Preview" />
                    <button onClick={() => setImageFile(null)} className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full">
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-4 pb-8">
                <button
                  disabled={!eventText.trim() && !imageFile}
                  onClick={goToAttribution}
                  className={`w-full py-5 rounded-[24px] font-bold text-lg shadow-xl active:scale-[0.98] transition-all disabled:opacity-20 disabled:grayscale ${isDarkTheme ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}
                >
                  下一步
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ATTRIBUTION */}
          {step === InputStep.ATTRIBUTION && (
            <div className="relative flex-1 min-h-full flex flex-col p-6 animate-fade-in">
              <div className="flex-1 flex flex-col justify-center items-center space-y-12">
                 <div className="text-center space-y-2">
                    <h3 className={`text-3xl font-light ${textColor}`}>这份光芒...</h3>
                    <p className={`text-sm tracking-widest uppercase ${subTextColor}`}>来自何处？</p>
                 </div>

                 <div className="w-full grid grid-cols-1 gap-6">
                   <button 
                    onClick={() => handleSourceSelect(HappinessSource.INTERNAL)}
                    className={`group relative flex items-center gap-6 p-6 backdrop-blur-md rounded-[32px] border-2 transition-all active:scale-95 text-left shadow-sm hover:shadow-md hover:border-indigo-300 ${cardBg}`}
                   >
                     <div className="p-5 bg-amber-100 text-amber-500 rounded-full group-hover:scale-110 transition-transform"><Heart size={32} /></div>
                     <div>
                       <h4 className={`text-xl font-bold mb-1 ${isDarkTheme ? 'text-white' : 'text-slate-800'}`}>内在的力量</h4>
                       <p className={`text-xs ${isDarkTheme ? 'text-white/60' : 'text-slate-500'}`}>是我让这件事发生的 / 我掌控了局面</p>
                     </div>
                   </button>

                   <button 
                    onClick={() => handleSourceSelect(HappinessSource.EXTERNAL)}
                    className={`group relative flex items-center gap-6 p-6 backdrop-blur-md rounded-[32px] border-2 transition-all active:scale-95 text-left shadow-sm hover:shadow-md hover:border-pink-300 ${cardBg}`}
                   >
                     <div className="p-5 bg-pink-100 text-pink-500 rounded-full group-hover:scale-110 transition-transform"><Gift size={32} /></div>
                     <div>
                       <h4 className={`text-xl font-bold mb-1 ${isDarkTheme ? 'text-white' : 'text-slate-800'}`}>世界的馈赠</h4>
                       <p className={`text-xs ${isDarkTheme ? 'text-white/60' : 'text-slate-500'}`}>我遇见了美好 / 我是被爱的</p>
                     </div>
                   </button>
                 </div>
              </div>
            </div>
          )}

          {/* STEP 3: LINKING */}
          {step === InputStep.LINKING && (
            <div className="flex-1 flex flex-col p-6 animate-fade-in space-y-4">
               {/* Context */}
               <div className={`relative p-5 rounded-2xl flex items-start gap-3 opacity-90 scale-95 origin-top border ${isDarkTheme ? 'bg-white/10 border-white/10' : 'bg-white/40 border-white'}`}>
                  <Quote size={20} className="text-indigo-400 shrink-0 mt-0.5" />
                  <p className={`text-sm italic line-clamp-3 leading-relaxed ${isDarkTheme ? 'text-white/80' : 'text-slate-700'}`}>
                    {eventText || "[图片记录]"}
                  </p>
               </div>

               <div className="space-y-1 pt-2">
                 <h3 className={`text-2xl font-light leading-snug ${textColor}`}>
                   你感受到了什么力量？<br/>为什么会感受到这种力量？
                 </h3>
                 <p className={`text-sm opacity-60 ${textColor}`}>点击灵感条，或写下你的答案</p>
               </div>

               {/* Ticker */}
               <div className="relative h-24 w-full mb-2">
                 {availableTemplates.length > 0 ? (
                   <button 
                     onClick={applyTemplate}
                     className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-50/90 to-purple-50/90 backdrop-blur-sm border-2 border-indigo-100 rounded-2xl flex items-center justify-between px-6 shadow-sm hover:shadow-md transition-all group overflow-hidden"
                   >
                     <div className="flex items-center gap-4 flex-1 overflow-hidden text-left">
                       <div className="p-3 bg-white rounded-full shadow-sm text-indigo-500 shrink-0">
                         <Wand2 size={20} className="animate-pulse" />
                       </div>
                       <div className="flex flex-col items-start overflow-hidden gap-1">
                          <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            {availableTemplates[tickerIndex].strengthName}
                          </span>
                          <p key={tickerIndex} className="text-slate-800 text-sm font-medium leading-tight line-clamp-2 animate-fade-in-up">
                            {availableTemplates[tickerIndex].text}
                          </p>
                       </div>
                     </div>
                     <ChevronRight size={20} className="text-indigo-300 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                     <div key={`progress-${tickerIndex}`} className="absolute bottom-0 left-0 h-1 bg-indigo-400/20 w-full">
                       <div className="h-full bg-indigo-400 w-full animate-[width_4s_linear] origin-left"></div>
                     </div>
                   </button>
                 ) : (
                   <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
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
                   className={`w-full h-full backdrop-blur-md rounded-[32px] p-6 text-lg leading-relaxed border-2 focus:outline-none focus:border-indigo-300 resize-none shadow-sm transition-colors ${isDarkTheme ? 'bg-white/10 text-white border-white/10 placeholder:text-white/30' : 'bg-white/60 text-slate-800 border-indigo-50 placeholder:text-slate-400'}`}
                 />
               </div>

               <button
                  disabled={!insightText.trim()}
                  onClick={goToPreview}
                  className={`w-full py-5 rounded-[24px] font-bold text-lg shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale ${isDarkTheme ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}
                >
                  <Sparkles size={20} className="text-yellow-400" />
                  预览能量
                </button>
            </div>
          )}

          {/* STEP 4: PREVIEW (整合页) */}
          {step === InputStep.PREVIEW && (
             <div className="flex-1 flex flex-col p-6 animate-fade-in text-white space-y-6 overflow-y-auto pb-32">
                <div className="text-center space-y-2 pt-4">
                  <h3 className="text-2xl font-light">能量配方已就绪</h3>
                  <p className="text-white/50 text-xs tracking-widest uppercase">The Formula</p>
                </div>

                {/* Recipe List */}
                <div className="flex-1 flex flex-col gap-0 items-center">
                  
                  {/* Item 1: Event */}
                  <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 relative z-10">
                     <span className="absolute -left-3 top-6 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg ring-4 ring-slate-900">1</span>
                     <p className="text-sm text-white/60 mb-1 font-bold uppercase tracking-wider">客观事实</p>
                     <p className="text-lg leading-relaxed">{eventText}</p>
                     {imageFile && <img src={imageFile} className="mt-4 rounded-lg w-full h-32 object-cover opacity-80" alt="Event" />}
                  </div>

                  {/* Connector */}
                  <div className="w-1 h-8 bg-white/10"></div>

                  {/* Item 2: Source (Text Mode) */}
                  <div className="w-full flex flex-col items-center justify-center py-4 relative z-20">
                    <div className={`p-4 rounded-full mb-3 ${source === HappinessSource.INTERNAL ? 'bg-amber-100 text-amber-500' : 'bg-pink-100 text-pink-500'} shadow-[0_0_20px_rgba(255,255,255,0.3)]`}>
                       {source === HappinessSource.INTERNAL ? <Heart size={24} /> : <Gift size={24} />}
                    </div>
                    <p className="text-lg font-medium text-white text-center tracking-wide drop-shadow-md">
                      {source === HappinessSource.INTERNAL ? "我感受到了我自己的内在力量" : "我接受到了世界的馈赠"}
                    </p>
                  </div>

                  {/* Connector */}
                  <div className="w-1 h-8 bg-white/10"></div>

                  {/* Item 3: Insight */}
                  <div className="w-full bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-md rounded-2xl p-6 border border-indigo-500/30 shadow-lg relative z-10">
                     <span className="absolute -left-3 top-6 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg ring-4 ring-slate-900">3</span>
                     <p className="text-sm text-purple-200 mb-1 font-bold uppercase tracking-wider">主观意义</p>
                     <p className="text-xl font-serif italic text-white leading-relaxed">"{insightText}"</p>
                     <div className="absolute top-4 right-4 text-white/10"><Sparkles size={40} /></div>
                  </div>

                </div>

                <button
                  onClick={handleInjectPower}
                  className="w-full py-5 mt-auto rounded-[24px] font-bold text-lg shadow-[0_0_40px_rgba(167,139,250,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 bg-white text-indigo-950 animate-pulse hover:animate-none"
                >
                  <Zap size={20} className="fill-indigo-950" />
                  注入水晶球
                </button>
             </div>
          )}

          {/* STEP 5: CRYSTALLIZATION (动画页) */}
          {step === InputStep.CRYSTALLIZE && (
             <div className="fixed inset-0 z-[60] bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
                
                {/* 1. Converging Particles */}
                {/* 
                   KEY FIX: Position particles in the DEAD CENTER initially (top-1/2 left-1/2).
                   The CSS animation `converge-xxx` will handle moving them FROM outside TO this center point.
                */}
                
                {/* Event Particle (From Top) */}
                <div className={`absolute top-1/2 left-1/2 w-4 h-4 -ml-2 -mt-2 bg-white rounded-full blur-[2px] shadow-[0_0_20px_white] z-20 ${isCrystalAnimating ? 'animate-converge-top' : 'opacity-0'}`}></div>
                
                {/* Source Particle (From Left) */}
                <div className={`absolute top-1/2 left-1/2 w-6 h-6 -ml-3 -mt-3 bg-amber-400 rounded-full blur-[4px] shadow-[0_0_30px_orange] z-20 ${isCrystalAnimating ? 'animate-converge-left' : 'opacity-0'}`}></div>
                
                {/* Insight Particle (From Right) */}
                <div className={`absolute top-1/2 left-1/2 w-6 h-6 -ml-3 -mt-3 bg-purple-400 rounded-full blur-[4px] shadow-[0_0_30px_purple] z-20 ${isCrystalAnimating ? 'animate-converge-right' : 'opacity-0'}`}></div>

                {/* 2. The Crystal Ball */}
                <div className="relative w-64 h-64 flex items-center justify-center z-10">
                   {/* Glow Layer */}
                   <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-[60px] animate-pulse"></div>
                   
                   {/* Ball Container */}
                   <div className="relative w-48 h-48 rounded-full bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/20 shadow-[inset_0_0_40px_rgba(255,255,255,0.1)] overflow-hidden animate-crystal-pulse">
                      
                      {/* Inner Magic Swirl */}
                      <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(167,139,250,0.3)_90deg,transparent_180deg,rgba(59,130,246,0.3)_270deg,transparent_360deg)] animate-swirl opacity-50 blur-xl"></div>
                      
                      {/* Shine Highlight */}
                      <div className="absolute top-4 left-8 w-16 h-8 bg-white/20 rounded-full blur-xl transform -rotate-12"></div>
                   </div>
                </div>

                {/* 3. Success Text */}
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
  );
};

export default MoodInput;
