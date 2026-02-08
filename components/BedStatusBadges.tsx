
import React, { memo } from 'react';
import { Syringe, Hand, Zap, ArrowUpFromLine, Droplet, LucideIcon } from 'lucide-react';
import { BedState, BedStatus } from '../types';

interface BedStatusBadgesProps {
  bed: BedState;
  isDesktop?: boolean;
}

interface BadgeConfig {
  key: keyof BedState;
  label: string;
  icon: LucideIcon;
  colorClass: string; // Text color
}

const BADGES: BadgeConfig[] = [
  { key: 'isInjection', label: '주사', icon: Syringe, colorClass: 'text-red-500' },
  { key: 'isFluid', label: '수액', icon: Droplet, colorClass: 'text-cyan-500' },
  { key: 'isManual', label: '도수', icon: Hand, colorClass: 'text-violet-500' },
  { key: 'isESWT', label: '충격파', icon: Zap, colorClass: 'text-blue-500' },
  { key: 'isTraction', label: '견인', icon: ArrowUpFromLine, colorClass: 'text-orange-500' }
];

export const BedStatusBadges: React.FC<BedStatusBadgesProps> = memo(({ bed, isDesktop = false }) => {
  if (bed.status === BedStatus.IDLE) return null;
  const activeBadges = BADGES.filter(b => bed[b.key]);
  if (activeBadges.length === 0) return null;

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
