export default function TimerButton({ running, onToggle, disabled }) {
  return (
    <button
      className={`timer ${running ? 'pause' : 'play'}`}
      onClick={onToggle}
      aria-label={running ? 'Pause timer' : 'Start timer'}
      disabled={disabled}
    >
      {running ? 'Pause' : 'Start'}
    </button>
  )
}
