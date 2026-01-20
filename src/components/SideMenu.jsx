export default function SideMenu({ open, onClose, onNavigate, activePage }) {
  return (
    <div className={`side-menu ${open ? 'open' : ''}`}>
      <button className="close" onClick={onClose}>✕</button>
      <nav>
        <button
          className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
          onClick={() => onNavigate?.('home')}
        >
          🏠 Home
        </button>
        <button
          className={`nav-link ${activePage === 'about' ? 'active' : ''}`}
          onClick={() => onNavigate?.('about')}
        >
          💖 About
        </button>
      </nav>
    </div>
  )
}
