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

export default function AreaMap({ records, today }: AreaMapProps) {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {AREAS.map((area) => {
        const days = daysSinceExercised(records, area, today);
        return (
          <li
            key={area}
            data-tone={areaTone(days)}
            className="space-y-1 rounded-lg border border-foreground/20 bg-muted px-3 py-3 data-[tone=fresh]:opacity-100 data-[tone=recent]:opacity-75 data-[tone=fading]:opacity-50 data-[tone=quiet]:opacity-25"
          >
            <p className="text-base font-medium">{AREA_CONFIG[area].label}</p>
            <p className="text-sm text-muted-foreground">{areaCaption(days)}</p>
          </li>
        );
      })}
    </ul>
  );
}
