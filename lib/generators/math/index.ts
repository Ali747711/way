import type { Family } from '../family';

import { averageSpeed } from './average-speed';
import { clockHands } from './clock-hands';
import { couponCollector } from './coupon-collector';
import { diceEvents } from './dice-events';
import { digitSumCount } from './digit-sum-count';
import { dominoTilings } from './domino-tilings';
import { eitherNotBoth } from './either-not-both';
import { gridPaths } from './grid-paths';
import { handshakes } from './handshakes';
import { josephus } from './josephus';
import { ladderSlip } from './ladder-slip';
import { lastDigitPowers } from './last-digit-powers';
import { pageDigits } from './page-digits';
import { remainders } from './remainders';
import { staircase } from './staircase';
import { trailingZeros } from './trailing-zeros';
import { workRates } from './work-rates';

export const mathFamilies: readonly Family[] = [
  eitherNotBoth,
  lastDigitPowers,
  diceEvents,
  ladderSlip,
  averageSpeed,
  handshakes,
  pageDigits,
  trailingZeros,
  staircase,
  gridPaths,
  workRates,
  remainders,
  clockHands,
  josephus,
  dominoTilings,
  couponCollector,
  digitSumCount
];
