export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function getTodayIndex() {
  const jsDay = new Date().getDay() // Sun=0
  return jsDay === 0 ? 6 : jsDay - 1
}

export function getTodayName() {
  return DAYS[getTodayIndex()]
}

export function getVisibleDays(startIndex, showAllDays) {
  return showAllDays ? DAYS : DAYS.slice(startIndex)
}
