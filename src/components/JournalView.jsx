export default function JournalView({ journal, onBack }) {
  if (!journal) {
    return (
      <div className="page">
        <div className="page-header">
          <button className="ghost" onClick={onBack}>⬅ Back</button>
          <h2>Journal</h2>
        </div>
        <div className="card">
          <div className="muted">Journal not found.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="ghost" onClick={onBack}>⬅ Back</button>
        <h2>{journal.title}</h2>
      </div>

      <div className="card">
        <div className="muted small">{journal.date} • {journal.weather}</div>
        <div className="divider" />
        <div className="journal-text">
          {journal.text?.trim() ? journal.text : '—'}
        </div>
      </div>
    </div>
  )
}


