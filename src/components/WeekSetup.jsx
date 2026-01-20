import { getTodayIndex } from '../utils/days'

export default function WeekSetup({ onCreate }) {
  const createWeek = () => {
    onCreate({
      name: `Week 1`,
      startDayIndex: getTodayIndex(),
      showAllDays: false
    })
  }

  return <button onClick={createWeek}>Create Week</button>
}
