import { useState } from 'react'

export default function JournalPage({ todayISO, onCreateJournal, onBack }) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(todayISO)
  const [weather, setWeather] = useState('☀️')
  const [text, setText] = useState('')

  const canSave = title.trim().length > 0 || text.trim().length > 0

  const save = () => {
    if (!canSave) return
    onCreateJournal?.({ title, date, weather, text })
    setTitle('')
    setText('')
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="ghost" onClick={onBack}>⬅ Back</button>
        <h2>Create journal</h2>
      </div>

      <div className="card">
        <p className="muted small">
          Write how your day feels. Your journal will be saved and listed on the home page 💖
        </p>

        <div className="row wrap" style={{ marginTop: 10 }}>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <input
            className="input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <select
            className="input"
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            aria-label="Weather"
            style={{ backgroundColor: 'transparent', color: '#fff' }}
          >
            <option value="☀️" style={{ backgroundColor: 'transparent', color: '#aa8800' }}>☀️ Sunny</option>
            <option value="🌤️" style={{ backgroundColor: 'transparent', color: '#4287f5' }}>🌤️ Soft sun</option>
            <option value="☁️" style={{ backgroundColor: 'transparent', color: '#aaaaaa' }}>☁️ Cloudy</option>
            <option value="🌧️" style={{ backgroundColor: 'transparent', color: '#4570bd' }}>🌧️ Rainy</option>
            <option value="🌙" style={{ backgroundColor: 'transparent', color: '#42467b' }}>🌙 Night</option>
            <option value="❄️" style={{ backgroundColor: 'transparent', color: '#6da0b6' }}>❄️ Snow</option>
          </select>
        </div>

        <textarea
          className="textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Your journal will go here…"
          rows={8}
        />

        <div className="row space" style={{ marginTop: 10 }}>
        
          <button className="primary" disabled={!canSave} onClick={save}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

