const MS_PER_DAY = 24 * 60 * 60 * 1000

function toUtcMidnight(date) {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

export function useDailyPsalm(options = {}) {
  const totalPsalms = options.totalPsalms ?? 150
  const startDate = options.startDate ?? '2026-01-01'

  function getChapter(date = new Date()) {
    const start = new Date(`${startDate}T00:00:00Z`)
    const elapsedDays = Math.floor((toUtcMidnight(date) - toUtcMidnight(start)) / MS_PER_DAY)
    const normalized = ((elapsedDays % totalPsalms) + totalPsalms) % totalPsalms

    return normalized + 1
  }

  return {
    getChapter,
  }
}
