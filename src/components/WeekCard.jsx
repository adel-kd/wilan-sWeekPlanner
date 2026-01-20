export default function WeekCard({ week, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        border:'1px solid #ccc',
        padding:'12px',
        width:'160px',
        cursor:'pointer'
      }}
    >
      <h4>{week.name}</h4>
      <p>{week.progress ?? 0}% done</p>
    </div>
  )
}
