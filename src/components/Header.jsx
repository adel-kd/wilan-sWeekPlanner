export default function Header({ onMenu }) {
  return (
    <header className="header">
      <div className="brand">
        <img src="/logo.png" />
        <span>Wilan's Week Planner</span>
      </div>
      <button className="hamburger" onClick={onMenu}>☰</button>
    </header>
  )
}
