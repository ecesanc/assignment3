# Assignment 3: Task Manager with a Reducer

**Full name:** Zeliha Ece Sancaklı  
**Student number:** 2024502135

MIS 233 Week 5 assignment implemented with React, TypeScript, `useReducer`, and Vitest.

## Run the project

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Required features completed

- `State` contains `tasks` and the selected `filter` (plus `past` for Undo).
- The reducer handles `add`, `advance`, `remove`, `setFilter`, and `clearDone`.
- The reducer is pure and uses an exhaustive discriminated-union switch.
- Filtered tasks and button counts are derived during rendering, never stored separately.
- The active filter, empty-list message, live counts, and Clear done button are included.

## Bonus 1: Undo

The state is `{ tasks, filter, past }`. `past` stores previous task arrays. Every task-changing action saves the old task list, while `undo` restores the latest saved list and removes it from `past`. Changing the filter is intentionally not undoable, and Undo is disabled when there is no history.

## Bonus 2: Tests

The project includes Vitest tests for every reducer action, status cycling, immutability, unknown IDs, empty operations, undo behavior, filtering, and counts after deletion.

Latest test command:

```text
npm test
# 9 tests passed
```

## Bonus 3: Explain your reducer

A reducer should be pure because React may call it more than once while checking updates, and because predictable input/output makes state changes easy to test. If a reducer mutates the old state, React can receive the same object reference and fail to notice an update. It can also make the previous state in an Undo history change unexpectedly, producing stale or inconsistent screens. In this project every changed object and array is copied instead.

The caller creates a task ID because generating an ID is an external decision, not a rule about how state changes. Passing the ID in the action keeps the reducer deterministic: the same state and action always produce the same result. It also makes reducer tests repeatable. The reducer never calls `crypto.randomUUID()`, reads the clock, or uses random values.

The visible list and the counts are derived from `state.tasks` during rendering. They are not stored because they are duplicates of information already present in the task list. For example, if a delete action updated `tasks` but forgot to update stored counts, the buttons could show old numbers while the list showed new data. Deriving both values prevents that synchronization bug. Moving the filter into reducer state makes every task-related rule and the selected view easy to follow in one state object. It is slightly more verbose because filter changes need a `setFilter` action, but it also gives the UI one clear source of truth.

## Bonus 4: Git repository

Repository link: https://github.com/ecesanc/assignment3

Before submission, create a GitHub repository named `assignment3` under the `ecesanc` account and push this project. The repository should include the four screenshots and exclude `node_modules`.

## Submission checklist

- [x] Full name and student number are included in this README and `taskReducer.ts`.
- [ ] Add `screenshots/all.png`, `todo.png`, `in-progress.png`, and `done.png`.
- [ ] Create `https://github.com/ecesanc/assignment3` and push the project.
- [ ] Run `npm install`, `npm run build`, and `npm test` before zipping.
- [ ] Zip the project folder without `node_modules`.
