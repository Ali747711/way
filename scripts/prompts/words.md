# Area: Words

Words problems are about letters and language: anagrams, word ladders, hidden words, "what connects these", letter patterns and light cryptic clues. Answers are one real word or a short phrase made of real words.

## Difficulty

- 1: the only band for Words; a clean, fair puzzle a newcomer can solve in a couple of minutes with the hints. Easy is not instant: the solver must search a set of candidates or make a choice, and the answer should click with a small "aha".

## What makes a good one

- The prompt sets the puzzle but does not solve it. Reject an idea where following the instructions literally produces the answer: swapping two named letters, joining two named words, reading the first letters of answers to obvious clues.
- One part of the puzzle confirms the other: both halves of a cryptic clue, every gap in a connection, the letter count and the meaning.
- Skip textbook pairs that many people already know: LISTEN/SILENT, LEMON/MELON, FLOUR/FLOWER, SMOG, CAR + PET, BARK, the COLD-to-WARM ladder.
- Vary the mechanic across a batch, and never repeat an answer word.

## Hints

- The last hint narrows the method (where to start, what to test), never the answer. No definition or synonym of the answer, and no "it starts with S" letter clues.

## Solver

- Words answers are exact, so a `solver` is optional. If you include one, write a function body that ends with `return` (it runs inside a function) and compute the answer, for example by searching a candidate list. Never return a hard-coded string.

## Pitfalls

- Ambiguous wording: if two different words fit the clue, tighten the clue or list both in `accepted`.
- Answers that need outside knowledge (brand names, trivia, other languages): use only common English words.
