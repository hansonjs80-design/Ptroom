
import React, { memo } from 'react';
import { BedState } from '../../types';
import { getBedNumberColor } from '../../utils/styleUtils';
import { BedStatusBadges } from '../BedStatusBadges';

interface BedNumberAndStatusProps {
  bed: BedState;
  onMovePatient: (e: React.MouseEvent) => void;
  onEditStatus: (e: React.MouseEvent) => void;
}

export const BedNumberAndStatus: React.FC<BedNumberAndStatusProps> = memo(({ bed, onMovePatient, onEditStatus }) => {
  const isBedT = bed.id === 11;
  return (
    <div className="flex items-center gap-2">
      {/* Bed Number */}
      <div 
        className="flex items-center justify-center cursor-pointer active:scale-95 transition-transform select-none"
        onDoubleClick={onMovePatient}
        title="더블클릭하여 환자 이동"
      >
        <span className={`font-black tracking-tighter leading-none text-3xl lg:text-5xl ${getBedNumberColor(bed)}`}>
          {isBedT ? 'T' : bed.id}
        </span>
      </div>

      {/* Status Icons Area */}
      <div 
        className="flex items-center cursor-pointer p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        onDoubleClick={onEditStatus}
        title="더블클릭하여 상태 아이콘 설정"
      >
        <BedStatusBadges bed={bed} />
      </div>
    </div>
  );
});
