import { useEffect, useState } from 'react'
import { hoursToSeconds } from '../utils/time'

export default function PlanInput({ week, onDone, onBack, readOnly }) {
  const [plans, setPlans] = useState(() => week?.todos ?? [])
  const [title, setTitle] = useState('')
  const [hours, setHours] = useState('')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    setPlans(week?.todos ?? [])
    setEditingId(null)
    setTitle('')
    setHours('')
  }, [week?.id])

  const addOrSave = () => {
    if (readOnly) return
    const t = title.trim()
    if (!t) return

    const h = hours.trim() === '' ? 0 : Number(hours)
    const hoursValue = Number.isFinite(h) && h >= 0 ? h : 0 // Allow 0 hours, no default

    if (editingId) {
      setPlans(p => p.map(x => {
        if (x.id === editingId) {
          const newHours = Number.isFinite(h) && h >= 0 ? h : 0
          return {
            ...x,
            title: t,
            totalSeconds: hoursToSeconds(newHours),
            remainingSeconds: hoursToSeconds(newHours)
          }
        }
        return x
      }))
      setEditingId(null)
    } else {
      setPlans(p => [{
      id: Date.now(),
        title: t,
        totalSeconds: hoursToSeconds(hoursValue),
        remainingSeconds: hoursToSeconds(hoursValue),
      checks: {}
      }, ...p])
    }

    setTitle('')
    setHours('')
  }

  const startEdit = (id) => {
    if (readOnly) return
    const t = plans.find(p => p.id === id)
    if (!t) return
    setEditingId(id)
    setTitle(t.title ?? '')
    const currentHours = (t.totalSeconds ?? 0) / 3600
    setHours(currentHours > 0 ? String(currentHours) : '')
  }

  const remove = (id) => {
    if (readOnly) return
    setPlans(p => p.filter(t => t.id !== id))
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="ghost" onClick={onBack}>⬅ Back</button>
        <h2>{week?.name ?? 'Week'}</h2>
      </div>

      <div className="card">
        <h3 className="card-title">Add plans (todos)</h3>

        <div className="row wrap">
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Todo name"
          />
          <input
            className="input"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="Hours (optional)"
            type="number"
            min="0"
            step="0.5"
          />
          <button className="pill" onClick={addOrSave}>
            {editingId ? 'Save' : '+ Add'}
          </button>
        </div>
<br />
        <div className="muted small">Tip: newest plans show on top ✨</div>
        {readOnly && <div className="muted small" style={{ marginTop: 10 }}>This week is finished • read only ✨</div>}
      </div>

      <div className="card">
        <div className="section-subhead">Your plans</div>
        {plans.length === 0 ? (
          <div className="muted">Add your first plan above 💗</div>
        ) : (
          <div className="todo-list">
        {plans.map(p => (
              <div key={p.id} className="todo-item">
                <div className="todo-title">{p.title}</div>
                <div className="row">
                  <button className="icon" onClick={() => startEdit(p.id)}>✏️</button>
                  <button className="icon" onClick={() => remove(p.id)}>🗑️</button>
                </div>
              </div>
        ))}
          </div>
        )}
      </div>

      <button className="primary full" disabled={readOnly || plans.length === 0} onClick={() => onDone(plans)}>
        Finish
      </button>
    </div>
  )
}
