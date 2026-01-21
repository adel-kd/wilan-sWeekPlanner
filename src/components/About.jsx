export default function About({ onBack }) {
  return (
    <div className="page">
      <div className="page-header">
        <button className="ghost" onClick={onBack}>⬅ Back</button>
        <h2>About</h2>
      </div>

      <div className="card">
        <h3>Made with love 💕</h3>

        <p className="muted">
This little app was made for the most beautiful and kind soul I know 🌷  
A soft companion for your days, made to remind you that every small step,  
every plan written down, and every moment you try truly matters 💖
        </p>

        <p className="muted">
          Don’t forget, konjit 💗  
          Every task you write, every box you tick,  
          is a small promise you keep to yourself ✨  
        </p>

        <p style={{ textAlign: 'right', marginRight: '40px' }}>
          <br /> — made by your husband 🤍
        </p>
      </div>

      <div className="card">
        <h3>How to use 🌸</h3>
        <ul className="list">
          <li>Create a week and give it a name that feels right 💭</li>
          <li>Add your plans and track your time gently ⏳</li>
          <li>Tick things off with pride — you’re doing great 🌟</li>
        </ul>
      </div>
    </div>
  )
}