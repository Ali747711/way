# Area: Code

Code problems ask the player to write a small JavaScript function that passes hidden tests. The prompt describes inputs, outputs and edge cases; the player sees 1-3 examples and the tests stay hidden.

## Difficulty

- 3: a short loop or string/array manipulation with one or two edge cases.
- 4: a small algorithm (two pointers, counting, simple recursion or dynamic programming).
- 5: see the deep problem notes when provided.

## Pitfalls

- Ambiguous wording: define input types, ordering, empty input and ties in the prompt; tests must not depend on unstated behaviour.
- Answers that need outside knowledge: use only plain JavaScript, no libraries and no Node APIs.

Test inputs are JSON values, so avoid undefined, NaN and Infinity. The `reference` must pass every example and test.
