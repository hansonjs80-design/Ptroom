
import React, { useState, useEffect } from 'react';
import { Syringe, Hand, Zap, ArrowUpFromLine, Droplet } from 'lucide-react';
import { PatientVisit } from '../../types';
import { ContextMenu } from '../common/ContextMenu';

interface StatusSelectionMenuProps {
  visit?: PatientVisit;
  position: { x: number; y: number };
  onClose: () => void;
  onToggle: (key: keyof PatientVisit) => void;
  title: string;
}

export const StatusSelectionMenu: React.FC<StatusSelectionMenuProps> = ({
  visit,
  position,
  onClose,
  onToggle,
  title
}) => {
  const statusOptions = [
    { key: 'is_injection', label: '주사 (Injection)', icon: Syringe, color: 'text-red-500' },
    { key: 'is_fluid', label: '수액 (Fluid)', icon: Droplet, color: 'text-cyan-500' },
    { key: 'is_manual', label: '도수 (Manual)', icon: Hand, color: 'text-violet-500' },
    { key: 'is_eswt', label: '충격파 (ESWT)', icon: Zap, color: 'text-blue-500' },
    { key: 'is_traction', label: '견인 (Traction)', icon: ArrowUpFromLine, color: 'text-orange-500' },
  ];

  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex(prev => (prev + 1) % statusOptions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex(prev => (prev - 1 + statusOptions.length) % statusOptions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onToggle(statusOptions[focusedIndex].key as keyof PatientVisit);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, onToggle, onClose, statusOptions]);

  return (
    <ContextMenu
      title={title}
      position={position}
      onClose={onClose}
    >
      {statusOptions.map((opt, index) => {
        const isActive = visit ? !!visit[opt.key as keyof PatientVisit] : false;
        const isFocused = index === focusedIndex;

        return (
          <button
            key={opt.key}
            onClick={() => onToggle(opt.key as keyof PatientVisit)}
            onMouseEnter={() => setFocusedIndex(index)}
            className={`flex items-center justify-between p-2 rounded-lg transition-colors text-xs font-bold w-full outline-none ${isFocused ? 'bg-gray-100 dark:bg-slate-700 ring-1 ring-inset ring-brand-300' : ''
              } ${isActive
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-300'
              }`}
          >
            <div className="flex items-center gap-2">
              <opt.icon className={`w-4 h-4 ${isActive ? opt.color : 'text-gray-400'}`} />
              <span>{opt.label}</span>
            </div>
            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
          </button>
        );
      })}
    </ContextMenu>
  );
};
