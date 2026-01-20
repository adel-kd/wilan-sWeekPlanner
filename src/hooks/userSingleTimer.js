import { useRef } from 'react'

export default function useSingleTimer() {
  const intervalRef = useRef(null)
  const activeIdRef = useRef(null)

  const start = (id, onTick) => {
    if (activeIdRef.current && activeIdRef.current !== id) {
      clearInterval(intervalRef.current)
    }
    activeIdRef.current = id
    intervalRef.current = setInterval(onTick, 1000)
  }

  const stop = () => {
    clearInterval(intervalRef.current)
    activeIdRef.current = null
  }

  return { start, stop, activeIdRef }
}
