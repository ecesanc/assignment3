import { useReducer, type FormEvent } from 'react'
import { taskReducer, initialState, type Action, type Task } from './taskReducer'
import TaskRow from './TaskRow'
import type { Dispatch } from 'react'
import { countByFilter, filterTasks, FILTERS, type Filter } from './filter'

const filterLabels: Record<Filter, string> = {
  all: 'All',
  todo: 'To do',
  'in-progress': 'In progress',
  done: 'Done',
}

function AddForm({ dispatch }: { dispatch: Dispatch<Action> }) {
  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const title = String(formData.get('title') ?? '').trim()
    if (!title) return
    dispatch({ type: 'add', id: crypto.randomUUID(), title })
    event.currentTarget.reset()
  }

  return (
    <form onSubmit={addTask} style={styles.addForm}>
      <input name="title" placeholder="New task" aria-label="New task title" />
      <button type="submit">Add task</button>
    </form>
  )
}

function FilterBar({
  activeFilter,
  counts,
  dispatch,
}: {
  activeFilter: Filter
  counts: Record<Filter, number>
  dispatch: Dispatch<Action>
}) {
  return (
    <nav aria-label="Task filters" style={styles.filterBar}>
      {FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          aria-pressed={activeFilter === filter}
          onClick={() => dispatch({ type: 'setFilter', filter })}
          style={activeFilter === filter ? styles.activeFilter : styles.filter}
        >
          {filterLabels[filter]} ({counts[filter]})
        </button>
      ))}
    </nav>
  )
}

function TaskList({ tasks, dispatch }: { tasks: Task[]; dispatch: Dispatch<Action> }) {
  if (tasks.length === 0) {
    return <p role="status" style={styles.empty}>No tasks here.</p>
  }

  return (
    <ul style={styles.list}>
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          onNext={() => dispatch({ type: 'advance', id: task.id })}
          onDelete={() => dispatch({ type: 'remove', id: task.id })}
        />
      ))}
    </ul>
  )
}

export default function App() {
  const [state, dispatch] = useReducer(taskReducer, initialState)
  const counts = countByFilter(state.tasks)
  const visibleTasks = filterTasks(state.tasks, state.filter)

  return (
    <main style={styles.container}>
      <header>
        <h1>Task Manager</h1>
        <p style={styles.subtitle}>Manage your tasks with a pure reducer.</p>
      </header>
      <AddForm dispatch={dispatch} />
      <FilterBar activeFilter={state.filter} counts={counts} dispatch={dispatch} />
      <div style={styles.actions}>
        <button type="button" onClick={() => dispatch({ type: 'clearDone' })} disabled={counts.done === 0}>
          Clear done
        </button>
        <button type="button" onClick={() => dispatch({ type: 'undo' })} disabled={state.past.length === 0}>
          Undo
        </button>
        <span aria-live="polite" style={styles.history}>{state.tasks.length} task{state.tasks.length === 1 ? '' : 's'}</span>
      </div>
      <TaskList tasks={visibleTasks} dispatch={dispatch} />
    </main>
  )
}

const styles = {
  container: { maxWidth: 720, margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif', color: '#172033' },
  subtitle: { color: '#526079', marginTop: -8 },
  addForm: { display: 'flex', gap: 8, margin: '24px 0 16px' },
  filterBar: { display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 16 },
  filter: { border: '1px solid #cbd5e1', background: '#fff', color: '#334155' },
  activeFilter: { border: '1px solid #2563eb', background: '#2563eb', color: '#fff' },
  actions: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
  history: { marginLeft: 'auto', color: '#64748b', fontSize: 14 },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  empty: { padding: 24, textAlign: 'center' as const, color: '#64748b', background: '#f8fafc', borderRadius: 8 },
} as const
