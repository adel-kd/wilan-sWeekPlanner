import { useMemo, useState, useEffect } from 'react'
import Loader from './components/Loader'
import Header from './components/Header'
import SideMenu from './components/SideMenu'
import Home from './components/Home'
import PlanInput from './components/PlanInput'
import WeekTable from './components/WeekTable'
import About from './components/About'
import JournalPage from './components/JournalPage'
import JournalView from './components/JournalView'
import useSingleTimer from './hooks/userSingleTimer'
import { getTodayIndex, getTodayName, getVisibleDays } from './utils/days'
import { hoursToSeconds } from './utils/time'
import { load, save } from './utils/storage'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [menu, setMenu] = useState(false)
  const [page, setPage] = useState('home')
  const [weeks, setWeeks] = useState(() => {
    const w = load('weeks', [])
    return Array.isArray(w) ? w : []
  })
  const [activeWeekId, setActiveWeekId] = useState(null)
  const [journals, setJournals] = useState(() => {
    const j = load('journals', [])
    return Array.isArray(j) ? j : []
  })
  const [lastActiveDate, setLastActiveDate] = useState(() => {
    const lad = load('lastActiveDate', null)
    return typeof lad === 'string' ? lad : null
  })
  const [lastNotificationDate, setLastNotificationDate] = useState(() => {
    const lnd = load('lastNotificationDate', null)
    return typeof lnd === 'string' ? lnd : null
  })
  const [isInitialized, setIsInitialized] = useState(false)
  const [activeTimerId, setActiveTimerId] = useState(null)
  const [openJournalId, setOpenJournalId] = useState(null)

  const timer = useSingleTimer()
  const today = useMemo(() => getTodayName(), [])
  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), [])

  const activeWeek = useMemo(
    () => weeks.find(w => w.id === activeWeekId) ?? null,
    [weeks, activeWeekId]
  )

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
      setIsInitialized(true)
    }, 1200)
  }, [])

  // Only save after initial load is complete
  useEffect(() => {
    if (!isInitialized) return
    save('weeks', weeks)
  }, [weeks, isInitialized])

  useEffect(() => {
    if (!isInitialized) return
    save('journals', journals)
  }, [journals, isInitialized])

  useEffect(() => {
    if (!isInitialized) return
    save('lastActiveDate', lastActiveDate)
  }, [lastActiveDate, isInitialized])

  useEffect(() => {
    if (!isInitialized) return
    save('lastNotificationDate', lastNotificationDate)
  }, [lastNotificationDate, isInitialized])

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return
    if (Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {})
    }
  }, [])

  const markActiveToday = () => setLastActiveDate(todayISO)

  useEffect(() => {
    const inactiveToday = lastActiveDate !== todayISO
    if (typeof window === 'undefined' || !('Notification' in window)) return
    if (!inactiveToday || lastNotificationDate === todayISO) return
    if (Notification.permission !== 'granted') return

    try {
      // In-app notification
      new Notification('Plans waiting for u 💗', {
        body: 'Open your week or write a journal for today.',
        icon: '/logo192x192.png',
        badge: '/logo192x192.png'
      })

      // PWA / background notification when SW is ready
      if (navigator.serviceWorker && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification('Plans waiting for u 💗', {
            body: 'Tap to open Wilan Week Planner.',
            icon: '/logo192x192.png',
            badge: '/logo192x192.png'
          })
        }).catch(() => {})
      }
    } catch {
      // ignore
    }

    setLastNotificationDate(todayISO)
  }, [lastActiveDate, lastNotificationDate, todayISO])

  const newestFirstWeeks = useMemo(() => {
    return [...weeks].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
  }, [weeks])

  const newestFirstJournals = useMemo(() => {
    return [...journals].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
  }, [journals])

  const isWeekReadOnly = (week) => {
    if (!week?.endISO) return false
    return todayISO > week.endISO
  }

  const computeWeekProgress = (week) => {
    const w = week
    const todos = w?.todos ?? []
    const visibleDays = getVisibleDays(w?.startDayIndex ?? 0, w?.showAllDays ?? true)
    const total = todos.length * visibleDays.length
    if (total === 0) return 0
    let done = 0
    for (const t of todos) {
      for (const d of visibleDays) {
        if (t?.checks?.[d]) done += 1
      }
    }
    return Math.min(100, Math.round((done / total) * 100))
  }

  const createJournal = (entry) => {
    const nextNumber =
      Math.max(0, ...journals.map(j => Number(j.number ?? 0))) + 1

    const journal = {
      id: Date.now(),
      number: nextNumber,
      createdAt: Date.now(),
      title: entry.title?.trim() || 'Untitled',
      date: entry.date || todayISO,
      weather: entry.weather || '☀️',
      text: entry.text?.trim() || ''
    }
    setJournals(j => [journal, ...j])
    markActiveToday()
  }

  const openJournal = (id) => {
    setOpenJournalId(id)
    setPage('journalView')
    markActiveToday()
  }

  const activeJournal = useMemo(() => {
    return journals.find(j => j.id === openJournalId) ?? null
  }, [journals, openJournalId])

  if (loading) return <Loader />

  return (
    <>
      <Header onMenu={() => setMenu(true)} />
      <div className="bg-watermark" aria-hidden="true"></div>
      <SideMenu
        open={menu}
        activePage={page}
        onClose={() => setMenu(false)}
        onNavigate={(next) => {
          setPage(next)
          setMenu(false)
        }}
      />

      {page === 'home' && (
        <Home
          inactiveToday={lastActiveDate !== todayISO}
          onMarkActive={markActiveToday}
          weeks={newestFirstWeeks.map(w => ({
            ...w,
            progress: computeWeekProgress(w),
            readOnly: isWeekReadOnly(w)
          }))}
          journals={newestFirstJournals}
          onCreateWeek={(name) => {
            const createdAt = Date.now()
            const createdDate = new Date(createdAt)
            const day = createdDate.getDay() // Sun=0
            const daysToSunday = (7 - day) % 7
            const end = new Date(createdDate)
            end.setHours(23, 59, 59, 999)
            end.setDate(end.getDate() + daysToSunday)
            const endISO = end.toISOString().slice(0, 10)

            const week = {
              id: createdAt,
              name: name?.trim() || 'My Week',
              createdAt,
              startDayIndex: getTodayIndex(),
              showAllDays: false,
              endISO,
              todos: []
            }
            setWeeks(w => [week, ...w])
            setActiveWeekId(week.id)
            setPage('plans')
            markActiveToday()
          }}
          onOpenWeek={(id) => {
            setActiveWeekId(id)
            const chosen = weeks.find(w => w.id === id)
            const hasPlans = (chosen?.todos?.length ?? 0) > 0
            setPage(hasPlans ? 'table' : 'plans')
            markActiveToday()
          }}
          onOpenJournal={() => setPage('journal')}
          onOpenJournalEntry={openJournal}
        />
      )}

      {page === 'plans' && (
        <PlanInput
          week={activeWeek}
          readOnly={isWeekReadOnly(activeWeek)}
          onDone={(p) => {
            if (!activeWeek) return
            if (isWeekReadOnly(activeWeek)) return
            setWeeks(ws => ws.map(w => w.id === activeWeek.id ? { ...w, todos: p } : w))
            setPage('table')
            markActiveToday()
          }}
          onBack={() => setPage('home')}
        />
      )}

      {page === 'table' && (
        <WeekTable
          week={activeWeek}
          todos={activeWeek?.todos ?? []}
          today={today}
          activeId={activeTimerId}
          readOnly={isWeekReadOnly(activeWeek)}
          onCreateAllDays={() => {
            if (!activeWeek) return
            if (isWeekReadOnly(activeWeek)) return
            setWeeks(ws => ws.map(w => w.id === activeWeek.id ? { ...w, showAllDays: true, startDayIndex: 0 } : w))
            markActiveToday()
          }}
          onToggleTimer={(todoId) => {
            if (!activeWeek) return
            if (isWeekReadOnly(activeWeek)) return
            const isRunning = timer.activeIdRef.current === todoId
            if (isRunning) {
              timer.stop()
              setActiveTimerId(null)
              return
            }
            timer.start(todoId, () => {
              setWeeks(ws => ws.map(w => {
                if (w.id !== activeWeek.id) return w
                return {
                  ...w,
                  todos: (w.todos ?? []).map(t => {
                    if (t.id !== todoId) return t
                    const next = Math.max(0, (t.remainingSeconds ?? 0) - 1)
                    return { ...t, remainingSeconds: next }
                  })
                }
              }))
            })
            setActiveTimerId(todoId)
            markActiveToday()
          }}
          onCheck={(todoId, day) => {
            if (!activeWeek) return
            if (isWeekReadOnly(activeWeek)) return
            setWeeks(ws => ws.map(w => {
              if (w.id !== activeWeek.id) return w
              return {
                ...w,
                todos: (w.todos ?? []).map(t => {
                  if (t.id !== todoId) return t
                  return {
                    ...t,
                    checks: { ...(t.checks ?? {}), [day]: !(t.checks?.[day] ?? false) }
                  }
                })
              }
            }))
            markActiveToday()
          }}
          onEditTodo={(todoId, nextTitle, nextHours) => {
            if (!activeWeek) return
            if (isWeekReadOnly(activeWeek)) return
            const title = nextTitle?.trim()
            if (!title) return
            const h = nextHours?.trim() === '' ? 0 : Number(nextHours)
            const hoursValue = Number.isFinite(h) && h >= 0 ? h : 0
            setWeeks(ws => ws.map(w => {
              if (w.id !== activeWeek.id) return w
              return {
                ...w,
                todos: (w.todos ?? []).map(t => {
                  if (t.id !== todoId) return t
                  return {
                    ...t,
                    title,
                    totalSeconds: hoursToSeconds(hoursValue),
                    remainingSeconds: hoursToSeconds(hoursValue)
                  }
                })
              }
            }))
            markActiveToday()
          }}
          onDeleteTodo={(todoId) => {
            if (!activeWeek) return
            if (isWeekReadOnly(activeWeek)) return
            timer.stop()
            setActiveTimerId(null)
            setWeeks(ws => ws.map(w => {
              if (w.id !== activeWeek.id) return w
              return { ...w, todos: (w.todos ?? []).filter(t => t.id !== todoId) }
            }))
            markActiveToday()
          }}
          onBack={() => setPage('home')}
        />
      )}

      {page === 'about' && <About onBack={() => setPage('home')} />}

      {page === 'journal' && (
        <JournalPage
          todayISO={todayISO}
          onBack={() => setPage('home')}
          onCreateJournal={createJournal}
        />
      )}

      {page === 'journalView' && (
        <JournalView
          journal={activeJournal}
          onBack={() => setPage('home')}
        />
      )}
    </>
  )
}
