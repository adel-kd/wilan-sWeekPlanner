import TimerButton from './TimerButton'
import { formatTime } from '../utils/time'

export default function TodoRow({
  todo, days, today, running,
  onToggleTimer, onCheck, onEdit, onDelete,
  readOnly
}) {
  return (
    <tr>
      <td>
        <div className="row space">
          <div>
            <div className="todo-title">{todo.title}</div>
          </div>
          <div className="row">
            <button className="icon" onClick={onEdit} aria-label="Edit" disabled={readOnly}>✏️</button>
            <button className="icon" onClick={onDelete} aria-label="Delete" disabled={readOnly}>🗑️</button>
          </div>
        </div>
      </td>

      <td>{formatTime(todo.remainingSeconds)}</td>
      <td><TimerButton running={running} onToggle={onToggleTimer} disabled={readOnly} /></td>

      {days.map(day => (
        <td key={day} className={day === today ? 'today-cell' : ''}>
          <input
            type="checkbox"
            checked={todo.checks[day] || false}
            onChange={() => onCheck(day)}
            disabled={readOnly}
          />
        </td>
      ))}
    </tr>
  )
}
