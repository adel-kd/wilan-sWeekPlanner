import TodoRow from './TodoRow'
import { getVisibleDays } from '../utils/days'
import { useState } from 'react'

export default function WeekTable({
  week, todos, today, activeId,
  onToggleTimer, onCheck, onEditTodo, onDeleteTodo, onBack,
  onCreateAllDays,
  readOnly
}) {
  const [editing, setEditing] = useState(null)
  const days = getVisibleDays(week?.startDayIndex ?? 0, week?.showAllDays ?? true)

  if (!week) {
    return (
      <div className="page">
        <div className="page-header">
          <button className="ghost" onClick={onBack}>⬅ Back</button>
          <h2>Week</h2>
        </div>
        <div className="card">
          <div className="muted">No week selected.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="ghost" onClick={onBack}>⬅ Back</button>
        <div>
          <h2 style={{ margin: 0 }}>{week.name}</h2>
          {readOnly && <div className="muted small">This week is finished • read only ✨</div>}
        </div>
        {!readOnly && !(week?.showAllDays ?? true) && (
          <button className="pill" onClick={onCreateAllDays}>
            Create all days
          </button>
        )}
      </div>

      <div className="card table-card">
        <div className="muted small">Tap start to use the timer  • check days as you go ✨</div>
      </div>

      {editing && (
        <div className="card">
          <div className="section-subhead">Edit todo</div>
          <div className="row wrap">
            <input
              className="input"
              value={editing.title}
              onChange={e => setEditing({ ...editing, title: e.target.value })}
              placeholder="Todo name"
            />
            <input
              className="input"
              type="number"
              min="0"
              step="0.5"
              value={editing.hours}
              onChange={e => setEditing({ ...editing, hours: e.target.value })}
              placeholder="Hours (optional)"
            />
            <button
              className="pill"
              onClick={() => {
                const nextTitle = editing.title.trim()
                if (nextTitle) {
                  onEditTodo && onEditTodo(editing.id, nextTitle, editing.hours)
                }
                setEditing(null)
              }}
              disabled={readOnly}
            >
              Save
            </button>
            <button className="ghost" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="card table-card">
        <table className="planner-table">
          <thead>
            <tr>
              <th>Todo</th>
              <th>Time</th>
              <th>Timer</th>
              {days.map(d => <th key={d}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {todos.map(t => (
              <TodoRow
                key={t.id}
                todo={t}
                days={days}
                today={today}
                running={activeId === t.id}
                onToggleTimer={() => onToggleTimer && onToggleTimer(t.id)}
                onCheck={day => onCheck && onCheck(t.id, day)}
                onEdit={() => !readOnly && setEditing({
                  id: t.id,
                  title: t.title ?? '',
                  hours: t.totalSeconds ? String(t.totalSeconds / 3600) : ''
                })}
                onDelete={() => onDeleteTodo && onDeleteTodo(t.id)}
                readOnly={readOnly}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
