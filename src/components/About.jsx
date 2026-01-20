export default function About({ onBack }) {
  return (
    <div className="page">
      <div className="page-header">
        <button className="ghost" onClick={onBack}>⬅ Back</button>
        <h2>About</h2>
      </div>

      <div className="card">
        <h3>Made with love  💕    </h3>
  
        <p className="muted">
        for the most beautiful and most hamble person I know, 
        </p>

        <p className="muted">
          Don forget konjit 
          Every step you write down is progress ✨
        </p>
        <p style={{ textAlign: 'right', marginRight: '50px' }}>
        <br />  by your husband
        </p>
      </div>

      <div className="card">
        <h3>How to use</h3>
        <ul className="list">
          <li>Create a week, add your todos, then track your days.</li>
          <li>Write a journal with a title, date, and weather mood.</li>
          <li>Newest weeks and journals always show on top.</li>
        </ul>
      </div>
    </div>
  )
}


