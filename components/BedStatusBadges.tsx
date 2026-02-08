import React, { memo } from 'react';
import { BedState, BedStatus } from '../types';
import { STATUS_BADGES, BadgeConfig } from '../constants';
import { hasAnyStatus } from '../utils/styleUtils';

interface BedStatusBadgesProps {
  bed: BedState;
  isDesktop?: boolean;
}

export const BedStatusBadges: React.FC<BedStatusBadgesProps> = memo(({ bed, isDesktop = false }) => {
  if (bed.status === BedStatus.IDLE) return null;
  if (!hasAnyStatus(bed)) return null;

  const activeBadges = STATUS_BADGES.filter(b => bed[b.key]);

  return (
    <div className="grid grid-cols-2 items-center justify-start gap-[0.25px] lg:gap-[2px] w-fit">
      {activeBadges.map((badge) => {
        const iconSize = isDesktop ? 21.2 : 18;
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
