import React, { memo } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { BedState, BedStatus } from '../../types';
import { getBedNumberColor, hasAnyStatus, getStatusAreaStyles } from '../../utils/styleUtils';
import { BedStatusBadges } from '../BedStatusBadges';

interface BedNumberAndStatusProps {
  bed: BedState;
  onMovePatient: (e: React.MouseEvent) => void;
  onEditStatus: (e: React.MouseEvent) => void;
}

export const BedNumberAndStatus: React.FC<BedNumberAndStatusProps> = memo(({ bed, onMovePatient, onEditStatus }) => {
  const isBedT = bed.id === 11;
  const isIdle = bed.status === BedStatus.IDLE;

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const isPortrait = useMediaQuery('(orientation: portrait)');
  const hasStatus = hasAnyStatus(bed);

  return (
    <div className="flex items-center gap-[5px] lg:gap-2">
      {/* Bed Number */}
      <div
        className={`flex items-center justify-center shrink-0 transition-transform select-none ${isIdle ? 'cursor-default' : 'cursor-pointer active:scale-95'}`}
        onDoubleClick={isIdle ? undefined : onMovePatient}
        title={isIdle ? undefined : "더블클릭하여 환자 이동"}
      >
        <span className={`font-black tracking-tighter leading-none text-3xl md:portrait:text-4xl lg:text-5xl ${getBedNumberColor(bed)}`}>
          {isBedT ? 'T' : bed.id}
        </span>
      </div>

      {/* Status Icons Area */}
      <div
        className={getStatusAreaStyles(hasStatus, isDesktop, isPortrait)}
        onClick={isDesktop ? onEditStatus : undefined}
        onDoubleClick={!isDesktop ? onEditStatus : undefined}
        title={isDesktop ? "클릭하여 상태 아이콘 설정" : "더블클릭하여 상태 아이콘 설정"}
      >
        <BedStatusBadges bed={bed} isDesktop={isDesktop} isPortrait={isPortrait} />
      </div>
    </div>
  );
});
