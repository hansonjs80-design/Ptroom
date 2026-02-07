
import React, { useState, useRef } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { PatientVisit } from '../../types';
import { PatientStatusIcons } from './PatientStatusIcons';
import { StatusSelectionMenu } from './StatusSelectionMenu';

interface PatientStatusCellProps {
  visit?: PatientVisit;
  rowStatus?: 'active' | 'completed' | 'none';
  onUpdate: (id: string, updates: Partial<PatientVisit>, skipBedSync?: boolean) => void;
  isDraft?: boolean;
  onCreate?: (updates: Partial<PatientVisit>) => Promise<string>;
}

export const PatientStatusCell: React.FC<PatientStatusCellProps> = ({
  visit,
  rowStatus = 'none',
  onUpdate,
  isDraft,
  onCreate
}) => {
  const [menuPos, setMenuPos] = useState<{ x: number, y: number } | null>(null);
  const cellRef = useRef<HTMLDivElement>(null);

  const moveFocus = (direction: 'up' | 'down' | 'left' | 'right') => {
    const currentCell = cellRef.current;
    if (!currentCell) return;

    const currentTd = currentCell.closest('td');
    const currentTr = currentCell.closest('tr');

    if (!currentTd || !currentTr) return;

    let targetElement: HTMLElement | null = null;
    let targetTd: Element | null = null;

    if (direction === 'up' || direction === 'down') {
      const targetTr = direction === 'up' ? currentTr.previousElementSibling : currentTr.nextElementSibling;
      if (targetTr) {
        const cellIndex = Array.from(currentTr.children).indexOf(currentTd);
        targetTd = targetTr.children[cellIndex];
      }
    } else {
      targetTd = direction === 'left' ? currentTd.previousElementSibling : currentTd.nextElementSibling;
    }

    if (targetTd) {
      // First try to find editable cell to click (enter edit mode)
      const editable = targetTd.querySelector('[data-editable-cell="true"]');
      if (editable) {
        (editable as HTMLElement).click();
        return;
      }
      // Then try to find navigable cell to focus
      const navigable = targetTd.querySelector('[data-navigable-cell="true"]');
      if (navigable) {
        (navigable as HTMLElement).focus();
        return;
      }
    }
  };

  const handleCellKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (cellRef.current) {
        const rect = cellRef.current.getBoundingClientRect();
        setMenuPos({ x: rect.left, y: rect.bottom });
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      moveFocus(e.shiftKey ? 'left' : 'right');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      moveFocus('right');
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      moveFocus('left');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveFocus('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveFocus('down');
    }
  };

  const executeInteraction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPos({ x: e.clientX, y: e.clientY });
  };

  const handleSingleClick = (e: React.MouseEvent) => {
    // Desktop/Tablet (>= 768px): Single Click triggers action
    if (window.innerWidth >= 768) {
      executeInteraction(e);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    // Mobile (< 768px): Double Click triggers action
    if (window.innerWidth < 768) {
      executeInteraction(e);
    }
  };

  const toggleStatus = async (key: keyof PatientVisit) => {
    const currentVal = visit ? !!visit[key] : false;
    const newVal = !currentVal;

    if (isDraft && onCreate) {
      await onCreate({ [key]: newVal });
    } else if (visit) {
      // Active Row: Sync with Bed (skipBedSync = false)
      // Inactive Row: Log Only (skipBedSync = true)
      const skipSync = rowStatus !== 'active';
      onUpdate(visit.id, { [key]: newVal }, skipSync);
    }
  };

  const menuTitle = rowStatus === 'active' ? "상태 변경 (배드 연동)" : "상태 변경 (단순 기록)";

  // Check if there are ANY active status flags. 
  // Even if 'visit' exists, flags might all be false.
  const hasActiveStatus = visit && (
    visit.is_injection ||
    visit.is_fluid ||
    visit.is_manual ||
    visit.is_eswt ||
    visit.is_traction
  );

  return (
    <>
      <div
        ref={cellRef}
        tabIndex={0}
        data-navigable-cell="true"
        className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group outline-none focus:ring-2 focus:ring-brand-500 focus:ring-inset rounded-sm"
        onClick={handleSingleClick}
        onDoubleClick={handleDoubleClick}
        onKeyDown={handleCellKeyDown}
        title={`클릭하여 상태 변경 (${rowStatus === 'active' ? '배드 연동' : '로그만 수정'})`}
      >
        {hasActiveStatus ? (
          <PatientStatusIcons visit={visit!} />
        ) : (
          <div className="opacity-0 group-hover:opacity-50 transition-opacity">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </div>
        )}
      </div>

      {menuPos && (
        <StatusSelectionMenu
          visit={visit}
          position={menuPos}
          onClose={() => setMenuPos(null)}
          onToggle={toggleStatus}
          title={menuTitle}
        />
      )}
    </>
  );
};
