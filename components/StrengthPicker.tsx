
import React, { useState, useMemo } from 'react';
import { UserTraits } from '../types';
import { STRENGTHS_DATA } from '../data/strengths';
import { ChevronRight, Check } from 'lucide-react';

interface Props {
  onComplete: (traits: UserTraits) => void;
}

const StrengthPicker: React.FC<Props> = ({ onComplete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);
  const [selectedIdeals, setSelectedIdeals] = useState<string[]>([]);
  const [mode, setMode] = useState<'current' | 'ideal'>('current');

  // 获取所有唯一分类
  const categories = useMemo(() => {
    return Array.from(new Set(STRENGTHS_DATA.map(s => s.category)));
  }, []);

  // 布局计算：基于分类（扇区）和 索引（轨道距离）
  const strengthsWithLayout = useMemo(() => {
    const layoutItems: any[] = [];
    const anglePerCategory = 360 / categories.length; // 每个分类占 60度

    categories.forEach((cat, catIndex) => {
      // 获取该分类下的所有力量
      const items = STRENGTHS_DATA.filter(s => s.category === cat);
      const baseAngle = catIndex * anglePerCategory;
      
      items.forEach((item, itemIndex) => {
        // 1. 距离计算 (Radius): 
        // 为了避免重叠，我们在 3 个轨道范围内波动
        // 基础距离 140px，每增加一个索引稍微往外推
        const radius = 130 + (itemIndex * 35) + (itemIndex % 2 * 10);
        
        // 2. 角度计算 (Angle):
        // 在该分类的 60度 扇区内分布。
        // 为了美观，我们在扇区中心左右摆动
        // 扇区中心 = baseAngle + 30
        const sectorCenter = baseAngle + 30;
        // 偏移量：比如 -15, +15, -10...
        const angleOffset = (itemIndex % 2 === 0 ? -1 : 1) * (10 + itemIndex * 4); 
        const angle = sectorCenter + angleOffset;

        layoutItems.push({
          ...item,
          layout: {
            radius,
            angle,
            colorClass: getCategoryColor(cat)
          }
        });
      });
    });
    return layoutItems;
  }, [categories]);

  const handleStrengthClick = (id: string) => {
    if (mode === 'current') {
      if (selectedStrengths.includes(id)) {
        setSelectedStrengths(prev => prev.filter(x => x !== id));
      } else {
        setSelectedStrengths(prev => [...prev, id]);
        setSelectedIdeals(prev => prev.filter(x => x !== id));
      }
    } else {
      if (selectedIdeals.includes(id)) {
        setSelectedIdeals(prev => prev.filter(x => x !== id));
      } else {
        if (!selectedStrengths.includes(id)) {
          setSelectedIdeals(prev => [...prev, id]);
        }
      }
    }
  };

  const handleFinish = () => {
    if (selectedStrengths.length === 0) return;
    onComplete({ strengths: selectedStrengths, ideals: selectedIdeals });
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden animate-fade-in">
      
      {/* 动态背景光晕 */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] pointer-events-none transition-all duration-[1500ms] ease-out ${isExpanded ? 'w-[800px] h-[800px] bg-indigo-900/10' : 'w-[400px] h-[400px] bg-amber-600/10'}`}></div>

      {/* 顶部引导文字 */}
      <div className={`absolute top-12 text-center px-6 z-10 transition-all duration-1000 ${isExpanded ? 'translate-y-0 opacity-100 delay-500' : 'translate-y-10 opacity-0'}`}>
        <h2 className="text-2xl font-light tracking-[0.2em] mb-2 text-white/90">选择我的力量</h2>
        <div className="h-0.5 w-12 bg-white/20 mx-auto mb-2"></div>
        <p className="text-slate-400 text-xs max-w-xs mx-auto leading-relaxed">
          {mode === 'current' ? "点亮你【目前拥有】的力量星" : "点亮你【向往拥有】的力量星"}
        </p>
      </div>

      {/* 初始状态提示语 */}
      {!isExpanded && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-28 text-center z-10 animate-pulse">
           <p className="text-amber-200/40 text-[10px] font-medium tracking-[0.5em] uppercase">触碰内在核心</p>
        </div>
      )}

      {/* 星系交互区 - 整体容器 */}
      <div className={`relative w-full h-full flex items-center justify-center overflow-visible transition-all duration-[1200ms] ease-out ${isExpanded ? 'scale-100 opacity-100' : 'scale-50 opacity-100'}`}>
        
        {/* 6大美德分类标签 (仅在展开时显示) */}
        {isExpanded && categories.map((cat, i) => {
          const angle = i * 60 + 30; // 扇区中心
          const rad = (angle * Math.PI) / 180;
          const dist = 320; // 标签距离中心的距离
          const x = Math.cos(rad) * dist;
          const y = Math.sin(rad) * dist;
          
          return (
            <div 
              key={cat}
              className="absolute text-white/30 text-[10px] font-bold tracking-[0.2em] pointer-events-none uppercase transition-all duration-1000 opacity-0 animate-fade-in"
              style={{
                transform: `translate(${x}px, ${y}px)`,
                animationDelay: `${1200 + i * 100}ms`,
                opacity: 0,
                animationFillMode: 'forwards'
              }}
            >
              {cat}
            </div>
          )
        })}

        {/* 核心球体 */}
        <button
          onClick={() => setIsExpanded(true)}
          className={`relative z-50 transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1)
            ${!isExpanded 
              ? 'w-32 h-32 bg-gradient-to-tr from-amber-400 via-yellow-200 to-orange-300 animate-core-breathe shadow-[0_0_100px_rgba(251,191,36,0.6)] hover:scale-105 active:scale-95' 
              : 'w-16 h-16 bg-white/5 backdrop-blur-2xl border border-white/10 scale-100 shadow-[0_0_40px_rgba(255,255,255,0.1)]'
            } rounded-full flex items-center justify-center group pointer-events-auto overflow-hidden`}
        >
          {!isExpanded && (
            <div className="absolute inset-0 rounded-full blur-xl bg-yellow-400/40 animate-pulse"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          
          {/* 展开后的核心文字 */}
          {isExpanded && (
             <span className="text-[10px] font-bold text-white/60 tracking-widest animate-fade-in delay-700">SELF</span>
          )}
        </button>

        {/* 环绕的 24 力量星 (小球) */}
        {/* 使用 spin-slow 让整个星系缓慢旋转，保持结构完整性 */}
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${isExpanded ? 'animate-spin-slow' : ''}`} style={{ animationDuration: '120s' }}>
          {strengthsWithLayout.map((s, i) => {
            const isCurrent = selectedStrengths.includes(s.id);
            const isIdeal = selectedIdeals.includes(s.id);
            
            // Stagger delay calculation (40ms per item)
            const delay = i * 40;

            return (
              <div
                key={s.id}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-[800ms] cubic-bezier(0.34, 1.56, 0.64, 1)
                  ${isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
                `}
                style={isExpanded ? {
                  transform: `rotate(${s.layout.angle}deg) translateX(${s.layout.radius}px) rotate(-${s.layout.angle}deg)`,
                  transitionDelay: `${delay}ms`
                } as any : {
                  transitionDelay: '0ms'
                }}
              >
                {/* 
                   在这里我们对每个小球做一个反向旋转的抵消，
                   以便当外层大容器旋转时，小球内的文字也能保持相对水平（或者至少不会乱转）。
                */}
                <div className="animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '120s' }}>
                  <button
                    onClick={() => handleStrengthClick(s.id)}
                    className={`pointer-events-auto flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 group relative
                      ${isCurrent 
                        ? `${s.layout.colorClass.active} scale-110 z-20 shadow-lg`
                        : isIdeal 
                          ? `${s.layout.colorClass.ideal} scale-105 z-10 border-dashed border-2`
                          : `${s.layout.colorClass.normal} hover:scale-105 hover:bg-white/10`
                      }
                      border backdrop-blur-sm
                    `}
                  >
                     <span className={`text-[9px] font-bold text-center leading-tight px-0.5 transform transition-transform group-hover:scale-105
                        ${(isCurrent || isIdeal) ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}
                     `}>
                       {s.name}
                     </span>
                     
                     {/* 选中指示器 */}
                     {isCurrent && <div className="absolute -top-1 -right-1 bg-white text-black rounded-full p-0.5"><Check size={8}/></div>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 底部交互面板 */}
      <div className={`absolute bottom-8 w-full max-w-sm px-8 space-y-6 transition-all duration-1000 delay-700 ${isExpanded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        
        {/* 模式切换 */}
        <div className="flex bg-white/5 backdrop-blur-md p-1 rounded-2xl border border-white/10 shadow-inner">
          <button 
            onClick={() => setMode('current')}
            className={`flex-1 py-3 rounded-xl text-xs font-bold tracking-widest transition-all duration-300
              ${mode === 'current' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            我的力量 ({selectedStrengths.length})
          </button>
          <button 
            onClick={() => setMode('ideal')}
            className={`flex-1 py-3 rounded-xl text-xs font-bold tracking-widest transition-all duration-300
              ${mode === 'ideal' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            向往 ({selectedIdeals.length})
          </button>
        </div>

        {/* 确认按钮 */}
        <button
          onClick={handleFinish}
          disabled={selectedStrengths.length === 0}
          className="w-full group flex items-center justify-between pl-8 pr-4 py-4 bg-white text-slate-950 rounded-[28px] font-black text-sm tracking-[0.2em] shadow-2xl active:scale-95 transition-all disabled:opacity-20 disabled:grayscale"
        >
          确认投影
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white transition-transform group-hover:translate-x-1 shadow-md">
             <ChevronRight size={20} />
          </div>
        </button>
      </div>
    </div>
  );
};

// 辅助函数：根据分类返回颜色样式
function getCategoryColor(category: string) {
  switch (category) {
    case '智慧':
      return {
        normal: 'bg-sky-900/40 border-sky-500/30 text-sky-200',
        active: 'bg-sky-500 text-white border-sky-400',
        ideal: 'bg-sky-900/60 text-sky-300 border-sky-400',
      };
    case '勇气':
      return {
        normal: 'bg-red-900/40 border-red-500/30 text-red-200',
        active: 'bg-red-500 text-white border-red-400',
        ideal: 'bg-red-900/60 text-red-300 border-red-400',
      };
    case '仁爱':
      return {
        normal: 'bg-pink-900/40 border-pink-500/30 text-pink-200',
        active: 'bg-pink-500 text-white border-pink-400',
        ideal: 'bg-pink-900/60 text-pink-300 border-pink-400',
      };
    case '公正':
      return {
        normal: 'bg-teal-900/40 border-teal-500/30 text-teal-200',
        active: 'bg-teal-500 text-white border-teal-400',
        ideal: 'bg-teal-900/60 text-teal-300 border-teal-400',
      };
    case '节制':
      return {
        normal: 'bg-indigo-900/40 border-indigo-500/30 text-indigo-200',
        active: 'bg-indigo-500 text-white border-indigo-400',
        ideal: 'bg-indigo-900/60 text-indigo-300 border-indigo-400',
      };
    case '卓越':
      return {
        normal: 'bg-purple-900/40 border-purple-500/30 text-purple-200',
        active: 'bg-purple-500 text-white border-purple-400',
        ideal: 'bg-purple-900/60 text-purple-300 border-purple-400',
      };
    default:
      return {
        normal: 'bg-slate-800 border-slate-600 text-slate-300',
        active: 'bg-slate-200 text-slate-900 border-white',
        ideal: 'bg-slate-800 text-slate-300 border-slate-400',
      };
  }
}

export default StrengthPicker;
