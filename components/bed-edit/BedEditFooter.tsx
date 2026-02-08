import React from 'react';

interface BedEditFooterProps {
    onDone: () => void;
}

export const BedEditFooter: React.FC<BedEditFooterProps> = ({ onDone }) => {
    return (
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shrink-0">
            <button
                onClick={onDone}
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-sm rounded-2xl font-bold shadow-lg shadow-slate-300 dark:shadow-none active:scale-[0.98] transition-all"
            >
                수정 완료 (Done)
            </button>
        </div>
    );
};
