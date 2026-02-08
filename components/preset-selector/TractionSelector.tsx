import React from 'react';
import { Play, Check, Clock } from 'lucide-react';

interface TractionSelectorProps {
    tractionDuration: number;
    setTractionDuration: (duration: number) => void;
    onStart: () => void;
    isLogMode: boolean;
}

export const TractionSelector: React.FC<TractionSelectorProps> = ({
    tractionDuration,
    setTractionDuration,
    onStart,
    isLogMode
}) => {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-8 p-4">
            <div className="relative">
                <div className="absolute inset-0 bg-orange-500 blur-[60px] opacity-10 rounded-full"></div>
                <div className="relative w-48 h-48 rounded-full border-[6px] border-orange-100 dark:border-orange-900/30 flex flex-col items-center justify-center bg-white dark:bg-slate-900 shadow-xl">
                    <Clock className="w-6 h-6 text-orange-400 mb-2 opacity-50" />
                    <span className="text-6xl font-black text-slate-800 dark:text-white tracking-tighter">
                        {tractionDuration}
                    </span>
                    <span className="text-sm font-bold text-gray-400 mt-1">MINUTES</span>
                </div>
                {/* Control Buttons */}
                <button
                    onClick={() => setTractionDuration(Math.max(1, tractionDuration - 1))}
                    className="absolute top-1/2 -left-6 -translate-y-1/2 w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-gray-100 dark:border-slate-700 flex items-center justify-center text-xl font-black text-slate-600 dark:text-slate-300 active:scale-90 transition-transform hover:bg-gray-50"
                >
                    -
                </button>
                <button
                    onClick={() => setTractionDuration(tractionDuration + 1)}
                    className="absolute top-1/2 -right-6 -translate-y-1/2 w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-gray-100 dark:border-slate-700 flex items-center justify-center text-xl font-black text-slate-600 dark:text-slate-300 active:scale-90 transition-transform hover:bg-gray-50"
                >
                    +
                </button>
            </div>

            <div className="flex gap-2">
                {[10, 15, 20].map(min => (
                    <button
                        key={min}
                        onClick={() => setTractionDuration(min)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${tractionDuration === min ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105' : 'bg-white dark:bg-slate-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                    >
                        {min}분
                    </button>
                ))}
            </div>

            <button
                onClick={onStart}
                className="w-full max-w-xs py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 transition-all active:scale-95"
            >
                {isLogMode ? <Check className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                {isLogMode ? '수정 완료' : '견인 치료 시작'}
            </button>
        </div>
    );
};
