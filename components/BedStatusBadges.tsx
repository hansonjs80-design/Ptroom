import React, { memo } from 'react';
import { BedState, BedStatus } from '../types';
import { STATUS_BADGES, BadgeConfig } from '../constants';
import { hasAnyStatus } from '../utils/styleUtils';

interface BedStatusBadgesProps {
  bed: BedState;
  isDesktop?: boolean;
  isPortrait?: boolean;
}

export const BedStatusBadges: React.FC<BedStatusBadgesProps> = memo(({ bed, isDesktop = false, isPortrait = false }) => {
  if (bed.status === BedStatus.IDLE) return null;
  if (!hasAnyStatus(bed)) return null;

  const activeBadges = STATUS_BADGES.filter(b => bed[b.key]);
  const isMultiPortrait = !isDesktop && isPortrait && activeBadges.length >= 2;

  return (
    <div className={`grid grid-cols-2 items-center justify-start ${isMultiPortrait ? 'gap-[-3.75px]' : 'gap-[0.25px]'} lg:gap-[2px] w-fit`}>
      {activeBadges.map((badge) => {
        let iconSize = isDesktop ? 21.2 : 18;

        // 모바일 세로 모드에서 아이콘이 2개 이상이면 15% 축소 (18 -> 15.3)
        if (isMultiPortrait) {
          iconSize = 15.3;
        }

        return (
          <div
            key={badge.label}
            className={`flex items-center justify-center p-0.5 rounded-full bg-transparent shadow-none ${badge.colorClass}`}
            title={badge.label}
          >
            <badge.icon
              size={iconSize}
              style={{ width: iconSize, height: iconSize }}
              className={badge.colorClass}
              strokeWidth={2.5}
            />
          </div>
        );
      })}
    </div>
  );
});
