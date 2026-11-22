import { describe, expect, it } from 'vitest'
import { countByFilter, filterTasks } from './filter'
import { initialState, taskReducer, type State, type Task } from './taskReducer'

const todo: Task = { id: '1', title: 'Write report', status: 'todo' }
const progress: Task = { id: '2', title: 'Review code', status: 'in-progress' }
const done: Task = { id: '3', title: 'Submit work', status: 'done' }

function stateWith(...tasks: Task[]): State {
  return { tasks, filter: 'all', past: [] }
}

describe('taskReducer', () => {
  it('adds, advances, and removes tasks', () => {
    const added = taskReducer(initialState, { type: 'add', id: '1', title: 'Write report' })
    expect(added.tasks).toEqual([todo])

    const advanced = taskReducer(added, { type: 'advance', id: '1' })
    expect(advanced.tasks[0].status).toBe('in-progress')

    const removed = taskReducer(advanced, { type: 'remove', id: '1' })
    expect(removed.tasks).toEqual([])
  })

  it('cycles a task through all three statuses', () => {
    let state = stateWith(todo)
    state = taskReducer(state, { type: 'advance', id: '1' })
    state = taskReducer(state, { type: 'advance', id: '1' })
    state = taskReducer(state, { type: 'advance', id: '1' })
    expect(state.tasks[0].status).toBe('todo')
  })

  it('sets the filter without changing tasks', () => {
    const state = taskReducer(stateWith(todo), { type: 'setFilter', filter: 'todo' })
    expect(state.filter).toBe('todo')
    expect(state.tasks).toEqual([todo])
    expect(state.past).toEqual([])
  })

  it('clears done tasks and keeps the current filter', () => {
    const before = { ...stateWith(todo, done), filter: 'done' as const }
    const after = taskReducer(before, { type: 'clearDone' })
    expect(after.tasks).toEqual([todo])
    expect(after.filter).toBe('done')
    expect(after.past).toEqual([[todo, done]])
  })

  it('undoes the latest task change but not a filter change', () => {
    const added = taskReducer(initialState, { type: 'add', id: '1', title: 'Write report' })
    const filtered = taskReducer(added, { type: 'setFilter', filter: 'todo' })
    const undone = taskReducer(filtered, { type: 'undo' })
    expect(undone.tasks).toEqual([])
    expect(undone.filter).toBe('todo')
    expect(undone.past).toEqual([])
    expect(taskReducer(undone, { type: 'undo' })).toBe(undone)
  })

  it('does not mutate the old state and handles unknown ids', () => {
    const before = stateWith(todo)
    const copy = structuredClone(before)
    const after = taskReducer(before, { type: 'advance', id: 'missing' })
    expect(before).toEqual(copy)
    expect(after.tasks).toEqual(before.tasks)
    expect(after).not.toBe(before)
  })

  it('handles an empty clearDone operation', () => {
    const before = stateWith(todo)
    const after = taskReducer(before, { type: 'clearDone' })
    expect(after.tasks).toEqual([todo])
    expect(after.past).toEqual([before.tasks])
  })
})

describe('filter helpers', () => {
  const tasks = [todo, progress, done]

  it('filters all supported statuses', () => {
    expect(filterTasks(tasks, 'all')).toEqual(tasks)
    expect(filterTasks(tasks, 'todo')).toEqual([todo])
    expect(filterTasks(tasks, 'in-progress')).toEqual([progress])
    expect(filterTasks(tasks, 'done')).toEqual([done])
    expect(filterTasks([], 'done')).toEqual([])
  })

  it('counts all statuses and reflects deletes', () => {
    expect(countByFilter(tasks)).toEqual({ all: 3, todo: 1, 'in-progress': 1, done: 1 })
    expect(countByFilter(tasks.filter((task) => task.id !== '3'))).toEqual({
      all: 2,
      todo: 1,
      'in-progress': 1,
      done: 0,
    })
    expect(countByFilter([])).toEqual({ all: 0, todo: 0, 'in-progress': 0, done: 0 })
  })
})
