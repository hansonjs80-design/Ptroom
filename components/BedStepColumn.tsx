
import React, { memo, useState, useMemo } from 'react';
import { TreatmentStep } from '../types';
import { getAbbreviation } from '../utils/bedUtils';
import { getStepColor } from '../utils/styleUtils';
import { PopupEditor } from './common/PopupEditor';
import { ArrowRightLeft } from 'lucide-react';

interface BedStepColumnProps {
  step: TreatmentStep;
  index: number;
  isActive: boolean;
  isPast: boolean;
  isCompleted: boolean;
  isSelectedForSwap: boolean;
  memo: string | undefined;
  bedId: number;
  onSwapRequest?: (id: number, idx: number) => void;
  onUpdateMemo?: (id: number, idx: number, val: string | null) => void;
}

export const BedStepColumn: React.FC<BedStepColumnProps> = memo(({
  step,
  index,
  isActive,
  isPast,
  isCompleted,
  isSelectedForSwap,
  memo,
  bedId,
  onSwapRequest,
  onUpdateMemo
}) => {
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const colorClass = getStepColor(step, isActive, isPast, false, isCompleted);

  const text = getAbbreviation(step.name);

  // Dynamic Font Size Logic based on text length to prevent line breaks
  const fontSizeClass = useMemo(() => {
    const len = text.length;
    if (len > 5) {
      // Long text (e.g. Magnet+Laser): 2 steps smaller
      return "text-xs xs:text-sm sm:text-lg lg:text-xl";
    } else if (len > 3) {
      // Medium text (e.g. TENS, ESWT): 1 step smaller
      return "text-sm xs:text-base sm:text-xl lg:text-2xl";
    }
    // Short text (e.g. HP, ICT): Standard size
    return "text-base xs:text-lg sm:text-2xl lg:text-3xl";
  }, [text]);

  const handleMemoDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onUpdateMemo) return;
    setIsEditingMemo(true);
  };

  const handleMemoSave = (val: string) => {
    if (onUpdateMemo) {
      onUpdateMemo(bedId, index, val === "" ? null : val);
    }
    setIsEditingMemo(false);
  };

  return (
    <>
      <div 
        className={`
          flex-1 flex flex-col h-full min-w-0 group/col relative transition-all duration-300
          ${isActive ? 'z-10 shadow-md transform scale-[1.02] rounded-lg my-[-1px]' : ''}
          ${isSelectedForSwap ? 'z-20' : ''}
        `}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onSwapRequest && onSwapRequest(bedId, index);
        }}
      >
        {/* Step Visual Block */}
        <div className={`
            flex-1 flex flex-col items-center justify-center p-1 relative overflow-hidden transition-all duration-200 
            ${colorClass}
            ${isSelectedForSwap ? 'ring-4 ring-indigo-500 ring-inset shadow-inner' : ''}
        `}>
            {/* 
              Text Styling:
              - fontSizeClass: Dynamic sizing based on length
              - whitespace-nowrap: Forces single line
              - tracking-tighter: Squeezes text slightly for better fit
            */}
            <span className={`
              font-black leading-none text-center px-0.5 whitespace-nowrap tracking-tighter
              ${fontSizeClass}
              ${isActive ? 'scale-110 drop-shadow-sm' : 'opacity-90'}
            `}>
              {text}
            </span>
            
            {/* Active Indicator Pulse */}
            {isActive && <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />}
            
            {/* Swap Overlay - Only covers the treatment part */}
            {isSelectedForSwap && (
              <div className="absolute inset-0 bg-indigo-500/90 flex items-center justify-center animate-in fade-in duration-200 z-10">
                 <ArrowRightLeft className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-bounce drop-shadow-md" strokeWidth={2.5} />
              </div>
            )}
        </div>

        {/* Memo Area - Integrated into the bottom */}
        <div 
          className={`
            h-[20px] sm:h-[26px] flex items-center justify-center px-1 cursor-pointer transition-colors select-none border-t border-black/5 dark:border-white/5
            ${isActive 
               ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200' 
               : 'bg-white/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400'
            }
          `}
          onDoubleClick={handleMemoDoubleClick}
        >
          {memo ? (
            // Updated Font Size: text-[10px] -> text-xs, sm:text-xs -> sm:text-sm
            <span className="text-xs sm:text-sm font-bold leading-tight text-center truncate w-full">
              {memo}
            </span>
          ) : (
            <span className="text-[10px] opacity-0 group-hover/col:opacity-30 transition-opacity font-bold">+</span>
          )}
        </div>
      </div>

      {isEditingMemo && (
        <PopupEditor
          title={`${text} 메모`}
          initialValue={memo || ""}
          type="text"
          centered={true}
          onConfirm={handleMemoSave}
          onCancel={() => setIsEditingMemo(false)}
        />
      )}
    </>
  );
});
