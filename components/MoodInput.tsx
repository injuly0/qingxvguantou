
import React, { useState, useRef, useEffect } from 'react';
import { MoodType, HappinessSource, UserTraits } from '../types';
import { analyzeMood } from '../services/geminiService';
import { ArrowLeft, Send, Sparkles, Gift, Heart, Camera, Mic, Image as ImageIcon, X } from 'lucide-react';
import StrengthPicker from './StrengthPicker';
import CalendarView from './CalendarView';

interface Props {
  mood: MoodType;
  onBack: () => void;
}

enum InputStep {
  RECORDING,     // Initial typing/uploading
  CATEGORIZING,  // Showing calendar/image and picking source
  INSIGHT        // Displaying AI result
}

const MoodInput: React.FC<Props> = ({ mood, onBack }) => {
  const [step, setStep] = useState<InputStep>(InputStep.RECORDING);
  const [inputText, setInputText] = useState('');
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [source, setSource] = useState<HappinessSource | null>(null);
  const [userTraits, setUserTraits] = useState<UserTraits | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isPositive = mood === MoodType.EUPHORIC || mood === MoodType.STABLE;

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

  const getDynamicTemplate = () => {
    if (!userTraits) return "在这里记录快乐瞬间...";
    const strength = userTraits.strengths[0];
    const ideal = userTraits.idealTrait;
    return `今天我发现自己很 ${strength}，因为我...`;
  };

  const startCategorizing = () => {
    if (!inputText.trim() && !imageFile) return;
    setStep(InputStep.CATEGORIZING);
  };

  const handleSourceSelect = async (selectedSource: HappinessSource) => {
    setSource(selectedSource);
    // AI 功能暂时注释掉
    /*
    setIsLoading(true);
    setStep(InputStep.INSIGHT);
    
    const context = userTraits ? 
      `用户优势: ${userTraits.strengths.join(',')}, 理想特质: ${userTraits.idealTrait}, 快乐来源: ${selectedSource}` : 
      '';
    const result = await analyzeMood(mood, `${context}\n用户记录: ${inputText}`);
    setResponse(result);
    setIsLoading(false);
    */

    // 直接进入洞察/珍藏页面，显示固定文字
    setResponse("这份珍贵的记忆已被妥善收藏。每一个闪光的瞬间，都是你力量的源泉。");
    setStep(InputStep.INSIGHT);
  };

  const getContainerBg = () => {
    if (step === InputStep.CATEGORIZING) return 'bg-black';
    switch (mood) {
      case MoodType.EUPHORIC: return 'from-sky-100 to-white';
      case MoodType.STABLE: return 'from-amber-50 to-emerald-50';
      case MoodType.DEPRESSED: return 'from-slate-900 to-slate-800';
      default: return 'from-white to-slate-100';
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col bg-gradient-to-b ${getContainerBg()} transition-all duration-700 overflow-hidden`}>
      {showPicker && <StrengthPicker onComplete={handleTraitsComplete} />}
      
      {/* Header - Ensure high z-index and clear positioning */}
      <div className={`relative p-6 flex items-center justify-between z-30 ${step === InputStep.CATEGORIZING ? 'text-white' : 'text-slate-800'}`}>
        <button onClick={onBack} className="p-2 rounded-full hover:bg-black/10 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] tracking-[0.2em] uppercase opacity-40 font-bold">
            {step === InputStep.RECORDING ? "捕捉回忆" : "深度洞察"}
          </span>
          <div className="h-1 w-6 bg-indigo-500 rounded-full mt-1"></div>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 relative overflow-y-auto no-scrollbar">
        <div className="min-h-full flex flex-col">
          
          {/* STEP 1: RECORDING */}
          {step === InputStep.RECORDING && (
            <div className="flex-1 flex flex-col p-6 animate-fade-in space-y-6">
              <h3 className="text-3xl font-light text-slate-800 mt-2 leading-snug select-none">
                记录下这个<br/><span className="font-semibold text-indigo-600">闪光的瞬间</span>
              </h3>
              
              <div className="flex-1 flex flex-col gap-4 min-h-[300px]">
                {/* Fixed: Use relative and z-10 for textarea to ensure clickability */}
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={getDynamicTemplate()}
                  className="relative z-10 w-full flex-1 min-h-[200px] bg-white/60 backdrop-blur-md rounded-[32px] p-8 text-xl border-2 border-white focus:outline-none focus:border-indigo-400 transition-all resize-none shadow-sm text-slate-800 placeholder:text-slate-400"
                />

                {/* Media Bar */}
                <div className="relative z-10 flex items-center gap-4">
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-4 rounded-2xl flex items-center gap-2 transition-all shadow-sm ${imageFile ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600'}`}
                  >
                    <ImageIcon size={20} />
                    <span className="text-sm font-medium">{imageFile ? "已添加图片" : "添加图片"}</span>
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
                  disabled={!inputText.trim() && !imageFile}
                  onClick={startCategorizing}
                  className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-bold text-lg shadow-xl active:scale-[0.98] transition-all disabled:opacity-20 disabled:grayscale"
                >
                  下一步
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CATEGORIZING (PREVIEW) */}
          {step === InputStep.CATEGORIZING && (
            <div className="relative flex-1 min-h-full flex flex-col animate-fade-in">
              <div className="absolute inset-0">
                {imageFile ? (
                  <div className="w-full h-full relative">
                    <img src={imageFile} className="w-full h-full object-cover" alt="Memory" />
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
                    <div className="absolute bottom-1/2 left-0 w-full p-8 text-white text-center italic text-xl drop-shadow-lg">
                      {inputText}
                    </div>
                  </div>
                ) : (
                  <CalendarView text={inputText} />
                )}
              </div>

              <div className="absolute inset-x-0 bottom-0 p-8 space-y-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-32 z-30">
                 <div className="text-white space-y-2">
                    <h4 className="text-2xl font-light">这份快乐源自...</h4>
                    <p className="text-sm opacity-60">请为这份记忆定调</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4 pb-8">
                   <button 
                    onClick={() => handleSourceSelect(HappinessSource.EXTERNAL)}
                    className="flex flex-col items-center gap-3 p-6 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-3xl border border-white/20 transition-all active:scale-95"
                   >
                     <div className="p-3 bg-pink-500/20 text-pink-400 rounded-2xl"><Gift size={24} /></div>
                     <span className="text-white font-medium">世界的馈赠</span>
                   </button>
                   <button 
                    onClick={() => handleSourceSelect(HappinessSource.INTERNAL)}
                    className="flex flex-col items-center gap-3 p-6 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-3xl border border-white/20 transition-all active:scale-95"
                   >
                     <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl"><Heart size={24} /></div>
                     <span className="text-white font-medium">内在的力量</span>
                   </button>
                 </div>
              </div>
            </div>
          )}

          {/* STEP 3: INSIGHT */}
          {step === InputStep.INSIGHT && (
            <div className="flex-1 p-8 flex flex-col animate-fade-in">
               <div className="max-w-sm mx-auto w-full space-y-8 py-8">
                  <div className="w-32 h-44 rounded-2xl shadow-2xl rotate-[-3deg] overflow-hidden border-4 border-white mx-auto relative z-10">
                    {imageFile ? <img src={imageFile} className="w-full h-full object-cover" alt="Memory thumbnail" /> : <CalendarView text={inputText} />}
                  </div>

                  {isLoading ? (
                    <div className="flex flex-col items-center gap-6 py-20">
                      <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      <p className="text-indigo-600 font-bold tracking-widest animate-pulse">正在连结深度洞察...</p>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-fade-in-up">
                      <div className="bg-white/60 backdrop-blur-md rounded-[40px] p-8 shadow-2xl border border-white space-y-4">
                        <Sparkles className="text-indigo-500" size={32} />
                        <div className="text-slate-800 text-lg leading-relaxed font-medium italic">
                          {response}
                        </div>
                      </div>
                      <button 
                        onClick={onBack}
                        className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-bold shadow-xl active:scale-[0.98] transition-all"
                      >
                        珍藏记忆
                      </button>
                    </div>
                  )}
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MoodInput;
