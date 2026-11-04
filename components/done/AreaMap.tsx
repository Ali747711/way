import AreaTile from '@/components/way/AreaTile';
import { AREAS, AREA_CONFIG } from '@/lib/areas';
import {
  areaCaption,
  areaTone,
  daysSinceExercised
} from '@/lib/state/selectors';
import type { WayState } from '@/lib/state/schema';
import { cn } from '@/lib/utils';

interface AreaMapProps {
  records: WayState['records'];
  today: string;
  className?: string;
}

// One row per area. The tile fades with the days since the area was last
// exercised; the label and caption stay at full contrast and carry it.
export default function AreaMap({ records, today, className }: AreaMapProps) {
  return (
    <ul
      role="list"
      className={cn(
        'divide-y divide-hairline border-y border-hairline',
        className
      )}
    >
      {AREAS.map((area) => {
        const days = daysSinceExercised(records, area, today);
        return (
          <li
            key={area}
            data-tone={areaTone(days)}
            className="group flex min-h-14 items-center gap-3.5 py-2"
          >
            <AreaTile
              area={area}
              size="md"
              className="group-data-[tone=fading]:opacity-55 group-data-[tone=quiet]:opacity-30 group-data-[tone=recent]:opacity-80"
            />
            <p className="text-[1.0625rem] font-extrabold">
              {AREA_CONFIG[area].label}
            </p>
            <p className="ml-auto text-[0.9375rem] text-ink-muted">
              {areaCaption(days)}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
