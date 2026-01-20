export const hoursToSeconds = (h) => Math.floor(h * 3600)

export const formatTime = (sec) => {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return `${h}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`
}

export const formatProgress = (doneSec, totalSec) => {
  return Math.min(100, Math.round((doneSec / totalSec) * 100))
}
