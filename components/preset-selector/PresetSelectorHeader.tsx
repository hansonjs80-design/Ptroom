import React from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { Preset } from '../../types';

interface PresetSelectorHeaderProps {
    targetBedId: number;
    isLogMode: boolean;
    isTractionBed: boolean;
    previewPreset: Preset | null;
    onBack: () => void;
    onClose: () => void;
}

export const PresetSelectorHeader: React.FC<PresetSelectorHeaderProps> = ({
    targetBedId,
    isLogMode,
    isTractionBed,
    previewPreset,
    onBack,
    onClose
}) => {
    // --- Dynamic Header Style Logic (Matching Bed Cards) ---
    const getHeaderStyle = () => {
        if (isLogMode) return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200';
        if (targetBedId === 11) return 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300';
        if (targetBedId >= 7) return 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300';
        if (targetBedId >= 3) return 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300';
        return 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300';
    };

    return (
        <div className={`p-4 sm:p-5 flex justify-between items-center shrink-0 transition-colors ${getHeaderStyle()}`}>
            <div className="flex items-center gap-3">
                {previewPreset && (
                    <button
                        onClick={onBack}
                        className="p-1 -ml-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                )}
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold opacity-70 uppercase tracking-wider leading-none mb-0.5">
                        {previewPreset ? '설정 확인' : (isLogMode ? '처방 수정' : '치료 시작')}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black leading-none tracking-tight">
                        {isLogMode ? 'Log Edit' : (isTractionBed ? 'Traction' : `BED ${targetBedId}`)}
                    </h3>
                </div>
            </div>
            <button
                onClick={onClose}
                className="p-2 bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 rounded-full transition-colors backdrop-blur-sm"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
};
