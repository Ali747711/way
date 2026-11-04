import { AREAS, AREA_CONFIG } from '@/lib/areas';
import {
  areaCaption,
  areaTone,
  daysSinceExercised
} from '@/lib/state/selectors';
import type { WayState } from '@/lib/state/schema';

interface AreaMapProps {
  records: WayState['records'];
  today: string;
}

// Phone: one row per area, label left and caption right. Wider screens: five
// tiles in a row. Tiles sit on the card colour so the muted caption keeps at
// least 4.5:1 contrast.
export default function AreaMap({ records, today }: AreaMapProps) {
  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-5">
      {AREAS.map((area) => {
        const days = daysSinceExercised(records, area, today);
        return (
          <li
            key={area}
            data-tone={areaTone(days)}
            className="group flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 sm:flex-col sm:items-stretch sm:gap-2 sm:px-3"
          >
            {/* Only the swatch fades; text stays at full contrast. */}
            <div
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-full bg-foreground group-data-[tone=fresh]:opacity-100 group-data-[tone=recent]:opacity-75 group-data-[tone=fading]:opacity-50 group-data-[tone=quiet]:opacity-25 sm:h-1.5 sm:w-auto"
            />
            <p className="text-base font-medium">{AREA_CONFIG[area].label}</p>
            <p className="ml-auto text-sm text-muted-foreground sm:ml-0">
              {areaCaption(days)}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
