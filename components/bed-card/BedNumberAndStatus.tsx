
import React, { memo } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { BedState, BedStatus } from '../../types';
import { getBedNumberColor } from '../../utils/styleUtils';
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
  const hasStatus = !isIdle && (bed.isInjection || bed.isFluid || bed.isManual || bed.isESWT || bed.isTraction);

  return (
    <div className="flex items-center gap-[5px] lg:gap-2">
      {/* Bed Number */}
      <div
        className={`flex items-center justify-center transition-transform select-none ${isIdle ? 'cursor-default' : 'cursor-pointer active:scale-95'}`}
        onDoubleClick={isIdle ? undefined : onMovePatient}
        title={isIdle ? undefined : "더블클릭하여 환자 이동"}
      >
        <span className={`font-black tracking-tighter leading-none text-3xl lg:text-5xl ${getBedNumberColor(bed)}`}>
          {isBedT ? 'T' : bed.id}
        </span>
      </div>

      {/* Status Icons Area */}
      <div
        className={`flex items-center cursor-pointer p-2 lg:p-[9px] w-auto min-w-[46px] lg:min-w-0 lg:w-auto h-10 lg:h-auto ${!isDesktop ? (hasStatus ? '-translate-x-[11px]' : 'translate-x-[4px]') : 'lg:translate-x-0'} lg:pr-[15px] rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all overflow-visible`}
        onClick={isDesktop ? onEditStatus : undefined}
        onDoubleClick={!isDesktop ? onEditStatus : undefined}
        title={isDesktop ? "클릭하여 상태 아이콘 설정" : "더블클릭하여 상태 아이콘 설정"}
      >
        <BedStatusBadges bed={bed} />
      </div>
    </div>
  );
});
