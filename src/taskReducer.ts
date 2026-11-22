// Full name: Zeliha Ece Sancaklı
// Student number: 2024502135

import type { Filter } from './filter'

export type Status = 'todo' | 'in-progress' | 'done'
export type Task = { id: string; title: string; status: Status }

export type State = {
  tasks: Task[]
  filter: Filter
  past: Task[][]
}

export type Action =
  | { type: 'add'; id: string; title: string }
  | { type: 'advance'; id: string }
  | { type: 'remove'; id: string }
  | { type: 'setFilter'; filter: Filter }
  | { type: 'clearDone' }
  | { type: 'undo' }

export const initialState: State = {
  tasks: [],
  filter: 'all',
  past: [],
}

const NEXT: Record<Status, Status> = {
  todo: 'in-progress',
  'in-progress': 'done',
  done: 'todo',
}

function withTaskHistory(state: State, tasks: Task[]): State {
  return {
    ...state,
    tasks,
    past: [...state.past, state.tasks],
  }
}

export function taskReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add':
      return withTaskHistory(state, [
        ...state.tasks,
        { id: action.id, title: action.title, status: 'todo' },
      ])
    case 'advance':
      return withTaskHistory(
        state,
        state.tasks.map((task) =>
          task.id === action.id
            ? { ...task, status: NEXT[task.status] }
            : task,
        ),
      )
    case 'remove':
      return withTaskHistory(
        state,
        state.tasks.filter((task) => task.id !== action.id),
      )
    case 'setFilter':
      return { ...state, filter: action.filter }
    case 'clearDone':
      return withTaskHistory(
        state,
        state.tasks.filter((task) => task.status !== 'done'),
      )
    case 'undo': {
      const previousTasks = state.past.at(-1)
      if (!previousTasks) return state
      return {
        ...state,
        tasks: previousTasks,
        past: state.past.slice(0, -1),
      }
    }
    default: {
      const exhaustiveAction: never = action
      return exhaustiveAction
    }
  }
}
