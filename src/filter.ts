import type { Status, Task } from './taskReducer'

export type Filter = 'all' | Status

export const FILTERS: Filter[] = ['all', 'todo', 'in-progress', 'done']

export function filterTasks(tasks: Task[], filter: Filter): Task[] {
  if (filter === 'all') return tasks
  return tasks.filter((task) => task.status === filter)
}

export function countByFilter(tasks: Task[]): Record<Filter, number> {
  const counts: Record<Filter, number> = {
    all: tasks.length,
    todo: 0,
    'in-progress': 0,
    done: 0,
  }

  for (const task of tasks) {
    counts[task.status] += 1
  }

  return counts
}
