import React from 'react';
import { Eraser } from 'lucide-react';

interface ClearLogButtonProps {
    onClear: () => void;
}

export const ClearLogButton: React.FC<ClearLogButtonProps> = ({ onClear }) => {
    return (
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shrink-0">
            <button
                onClick={onClear}
                className="w-full py-3 text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/30 rounded-2xl transition-colors flex items-center justify-center gap-2"
            >
                <Eraser className="w-4 h-4" />
                데이터 비우기 (Clear)
            </button>
        </div>
    );
};
