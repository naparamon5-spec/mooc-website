export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  let hasTriggeredInThisSession = false

  const shouldRun = () => {
    if (hasTriggeredInThisSession) return false

    const lastRunAt = window.localStorage.getItem('overdue_notice_last_run_at')
    const now = Date.now()

    if (!lastRunAt) return true

    const lastRunTime = Number(lastRunAt)
    if (!Number.isFinite(lastRunTime)) return true

    const twelveHours = 12 * 60 * 60 * 1000
    return now - lastRunTime >= twelveHours
  }

  const markRun = () => {
    hasTriggeredInThisSession = true
    window.localStorage.setItem('overdue_notice_last_run_at', String(Date.now()))
  }

  const runOverdueCheck = async () => {
    try {
      if (!shouldRun()) return

      await $fetch('/api/notices/check-overdue', {
        method: 'POST'
      })

      markRun()
    } catch (error) {
      console.error('Automatic overdue notice check failed:', error)
    }
  }

  if (document.readyState === 'complete') {
    runOverdueCheck()
  } else {
    window.addEventListener('load', runOverdueCheck, { once: true })
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      runOverdueCheck()
    }
  })
})
