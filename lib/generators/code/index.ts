import type { Family } from '../family';

import { addMinutes } from './add-minutes';
import { balancedBrackets } from './balanced-brackets';
import { bestPick } from './best-pick';
import { caesarShift } from './caesar-shift';
import { coinWays } from './coin-ways';
import { commonPrefix } from './common-prefix';
import { countIslands } from './count-islands';
import { countPairs } from './count-pairs';
import { daysToWarmer } from './days-to-warmer';
import { digitPersistence } from './digit-persistence';
import { groupUp } from './group-up';
import { interleaving } from './interleaving';
import { keepFirst } from './keep-first';
import { longestRun } from './longest-run';
import { latestTime } from './latest-time';
import { longestUnique } from './longest-unique';
import { luhnCheck } from './luhn-check';
import { maxDepth } from './max-depth';
import { missingNumber } from './missing-number';
import { pascalRow } from './pascal-row';
import { romanToInt } from './roman-to-int';
import { rotateGrid } from './rotate-grid';
import { runLengthDecode } from './run-length-decode';
import { secondLargest } from './second-largest';
import { topWords } from './top-words';

export const codeFamilies: readonly Family[] = [
  digitPersistence,
  caesarShift,
  runLengthDecode,
  secondLargest,
  longestRun,
  addMinutes,
  romanToInt,
  luhnCheck,
  keepFirst,
  groupUp,
  pascalRow,
  missingNumber,
  commonPrefix,
  maxDepth,
  rotateGrid,
  countPairs,
  balancedBrackets,
  topWords,
  latestTime,
  countIslands,
  coinWays,
  interleaving,
  longestUnique,
  daysToWarmer,
  bestPick
];
