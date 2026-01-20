import { useState } from 'react'

function formatJournalNumber(n) {
  return `#${String(n).padStart(3, '0')}`
}

export default function Home({
  weeks,
  journals,
  onCreateWeek,
  onOpenWeek,
  onOpenJournal,
  onOpenJournalEntry,
  inactiveToday,
  onMarkActive
}) {
  const [weekName, setWeekName] = useState('')
  const [showWeekForm, setShowWeekForm] = useState(false)

  return (
    <div className="page home">
      {inactiveToday && (
        <div className="banner">
          <div>
            <div className="banner-title">Plans waiting for u 💗</div>
            <div className="banner-sub">Open a week or write a journal to start your day.</div>
          </div>
          <button className="pill" onClick={onMarkActive}>I’m here</button>
        </div>
      )}

      <div className="section">
        <div className="section-head">
          <h2>Weeks</h2>
          <button
            className="primary"
            onClick={() => setShowWeekForm(v => !v)}
          >
            + Create Week
          </button>
        </div>

        {showWeekForm && (
          <div className="card">
            <div className="row">
              <input
                className="input"
                value={weekName}
                onChange={(e) => setWeekName(e.target.value)}
                placeholder="Week name (ex: Glow Week)"
              />
              <button
                className="pill"
                onClick={() => {
                  onCreateWeek?.(weekName)
                  setWeekName('')
                  setShowWeekForm(false)
                }}
              >
                Create
              </button>
            </div>
            <div className="muted small">Tip: your newest weeks show on top ✨</div>
          </div>
        )}

        {weeks.length === 0 && (
          <p className="empty">Your weeks go here 💕</p>
        )}

        <div className="weeks">
          {weeks.map(w => (
            <button
              key={w.id}
              className="week-card"
              onClick={() => onOpenWeek?.(w.id)}
            >
              <div className="week-title">{w.name}</div>
              <div className="muted small">
                {(w.todos?.length ?? 0)} todos • {w.progress ?? 0}% done
                {w.readOnly ? ' • read only' : ''}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h2>Journal</h2>
          <button className="primary" onClick={onOpenJournal}>
            + Create journal
          </button>
        </div>

        <div className="card">
          <div className="section-subhead">Journal list</div>
          {journals.length === 0 ? (
            <div className="muted">No journals yet. Write your first one ✨</div>
          ) : (
            <div className="journal-list">
              {journals.map(j => (
                <button
                  key={j.id}
                  className="journal-item journal-btn"
                  onClick={() => onOpenJournalEntry?.(j.id)}
                >
                  <div className="journal-num">{formatJournalNumber(j.number)}</div>
                  <div className="journal-main">
                    <div className="journal-title">{j.title}</div>
                    <div className="muted small">{j.date} • {j.weather}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
