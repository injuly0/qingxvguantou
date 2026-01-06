
import React from 'react';

interface Props {
  text: string;
}

const CalendarView: React.FC<Props> = ({ text }) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][now.getDay()];

  return (
    <div className="w-full h-full bg-[#fdfcf8] flex flex-col p-8 text-slate-900 font-serif relative overflow-hidden">
      {/* Calendar Header */}
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
        <div className="flex flex-col">
          <span className="text-4xl font-bold tracking-tighter">{day}</span>
          <span className="text-xs font-bold uppercase tracking-widest mt-1 opacity-60">
            {year}.{month < 10 ? `0${month}` : month}
          </span>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="text-sm font-bold">{weekDay}</span>
          <div className="w-6 h-1 bg-red-600 mt-2"></div>
        </div>
      </div>

      {/* Main Content (The "Daily Note") */}
      <div className="flex-1 flex flex-col justify-center items-center py-12">
        <div className="w-full max-w-[280px] relative">
          <span className="absolute -top-8 -left-4 text-6xl text-slate-200 font-serif">“</span>
          <p className="text-xl leading-relaxed text-center font-medium text-slate-800 break-words">
            {text}
          </p>
          <span className="absolute -bottom-12 -right-4 text-6xl text-slate-200 font-serif">”</span>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-auto pt-8 border-t border-slate-200 flex justify-between items-center opacity-40">
        <span className="text-[10px] tracking-widest uppercase font-bold">MoodFlow Memory</span>
        <span className="text-[10px] tracking-widest uppercase font-bold">力量源泉</span>
      </div>

      {/* Subtle Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }}></div>
    </div>
  );
};

export default CalendarView;
