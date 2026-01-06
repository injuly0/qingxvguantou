import React, { useState } from 'react';
import { UserTraits } from '../types';
import { Check, Sparkles, Target } from 'lucide-react';

const STRENGTH_OPTIONS = ['勇敢', '善良', '有好奇心', '心态好', '愿意改变', '富有创意', '幽默感', '正直'];
const IDEAL_OPTIONS = ['更坚持', '更有条理', '更自信', '更平和', '更果断'];

interface Props {
  onComplete: (traits: UserTraits) => void;
}

const StrengthPicker: React.FC<Props> = ({ onComplete }) => {
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);
  const [selectedIdeal, setSelectedIdeal] = useState<string>('');
  const [step, setStep] = useState(1);

  const toggleStrength = (s: string) => {
    if (selectedStrengths.includes(s)) {
      setSelectedStrengths(prev => prev.filter(item => item !== s));
    } else if (selectedStrengths.length < 3) {
      setSelectedStrengths(prev => [...prev, s]);
    }
  };

  const isComplete = step === 1 ? selectedStrengths.length > 0 : selectedIdeal !== '';

  const handleNext = () => {
    if (step === 1) setStep(2);
    else onComplete({ strengths: selectedStrengths, idealTrait: selectedIdeal });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-[32px] w-full max-w-sm p-8 shadow-2xl space-y-8">
        <div className="space-y-2 text-center">
          <div className="inline-flex p-3 bg-indigo-100 text-indigo-600 rounded-full mb-2">
            {step === 1 ? <Sparkles size={24} /> : <Target size={24} />}
          </div>
          <h2 className="text-2xl font-semibold text-slate-800">
            {step === 1 ? "识你的力量" : "向往的自己"}
          </h2>
          <p className="text-slate-500 text-sm">
            {step === 1 ? "选择 1-3 个你认为自己具备的优势" : "选择一个你希望进一步培养的特质"}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {(step === 1 ? STRENGTH_OPTIONS : IDEAL_OPTIONS).map(opt => {
            const isSelected = step === 1 ? selectedStrengths.includes(opt) : selectedIdeal === opt;
            return (
              <button
                key={opt}
                onClick={() => step === 1 ? toggleStrength(opt) : setSelectedIdeal(opt)}
                className={`px-4 py-2 rounded-full border-2 transition-all duration-300 text-sm font-medium flex items-center gap-2
                  ${isSelected 
                    ? 'bg-indigo-600 border-indigo-600 text-white scale-105 shadow-md' 
                    : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-indigo-200'}`}
              >
                {isSelected && <Check size={14} />}
                {opt}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={!isComplete}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold disabled:opacity-20 disabled:grayscale transition-all hover:bg-slate-800"
        >
          {step === 1 ? "继续" : "开启力量记录"}
        </button>
      </div>
    </div>
  );
};

export default StrengthPicker;