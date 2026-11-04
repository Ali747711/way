import AreaGlyph from '@/components/AreaGlyph';
import { areaVars } from '@/components/areaStyle';
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

// One ruled line per area, like a notebook page. The area's glyph fades with
// the days since it was last exercised; the text stays at full contrast.
export default function AreaMap({ records, today }: AreaMapProps) {
  return (
    <ul className="border-t border-border">
      {AREAS.map((area) => {
        const days = daysSinceExercised(records, area, today);
        return (
          <li
            key={area}
            data-tone={areaTone(days)}
            style={areaVars(area)}
            className="group flex min-h-13 items-center gap-3.5 border-b border-border"
          >
            <AreaGlyph
              area={area}
              className="size-4 text-(--area) group-data-[tone=fading]:opacity-50 group-data-[tone=quiet]:opacity-25 group-data-[tone=recent]:opacity-75"
            />
            <p className="text-base font-medium">{AREA_CONFIG[area].label}</p>
            <p className="ml-auto text-sm text-muted-foreground">
              {areaCaption(days)}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
