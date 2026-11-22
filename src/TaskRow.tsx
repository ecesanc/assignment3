import type { Task } from './taskReducer'

type TaskRowProps = { task: Task; onNext: () => void; onDelete: () => void }

const statusLabels: Record<Task['status'], string> = {
  todo: 'To do',
  'in-progress': 'In progress',
  done: 'Done',
}

export default function TaskRow({ task, onNext, onDelete }: TaskRowProps) {
  return (
    <li style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
      <span style={{ flex: 1 }}>{task.title}</span>
      <em style={{ color: '#526079', fontSize: 14 }}>{statusLabels[task.status]}</em>
      <button type="button" onClick={onNext} aria-label={`Advance ${task.title}`}>Next</button>
      <button type="button" onClick={onDelete} aria-label={`Delete ${task.title}`}>Delete</button>
    </li>
  )
}
