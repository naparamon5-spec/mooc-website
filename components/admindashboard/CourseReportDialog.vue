<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md ring-1 ring-gray-200">

        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-base font-semibold text-gray-900 leading-tight">Course Report</h2>
              <p class="text-xs text-gray-400 mt-0.5">Select a report to download</p>
            </div>
          </div>
          <button
            @click="$emit('close')"
            class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Buttons -->
        <div class="px-6 py-5 space-y-3">
          <button
            @click="downloadModuleCompletion"
            class="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition group"
          >
            <div class="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-200 transition">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div class="text-left">
              <p class="text-sm font-medium text-gray-800">Module Completion</p>
              <p class="text-xs text-gray-400">Last 14 days</p>
            </div>
            <svg class="w-4 h-4 text-gray-300 ml-auto group-hover:text-blue-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
          </button>

          <button
            @click="downloadEnrollment"
            class="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition group"
          >
            <div class="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0 group-hover:bg-green-200 transition">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
            <div class="text-left">
              <p class="text-sm font-medium text-gray-800">Enrollment Analytics</p>
              <p class="text-xs text-gray-400">Last 14 days</p>
            </div>
            <svg class="w-4 h-4 text-gray-300 ml-auto group-hover:text-green-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
          </button>

          <button
            @click="downloadCourseCompletion"
            class="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition group"
          >
            <div class="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center shrink-0 group-hover:bg-purple-200 transition">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
            </div>
            <div class="text-left">
              <p class="text-sm font-medium text-gray-800">Course Completion Rate</p>
              <p class="text-xs text-gray-400">By year</p>
            </div>
            <svg class="w-4 h-4 text-gray-300 ml-auto group-hover:text-purple-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
          </button>
        </div>

        <!-- Footer -->
        <div class="px-6 pb-5">
          <button
            @click="$emit('close')"
            class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { jsPDF } from 'jspdf'

const props = defineProps({
  isOpen:                { type: Boolean, default: false },
  moduleCompletionStats: { type: Array,   default: () => [] },
  enrollmentData:        { type: Array,   default: () => [] },
  courseCompletionRates: { type: Array,   default: () => [] }
})

defineEmits(['close'])

// FIX: Access Nuxt app and Supabase once at setup level, not inside each function.
const nuxtApp = useNuxtApp()
const supabase = nuxtApp.$supabase

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const getTimeAgo = (date: string): string => {
  const completionDate = new Date(date)
  const today = new Date()
  const diffDays = Math.ceil(Math.abs(today.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  const weeks = Math.floor(diffDays / 7)
  return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
}

/** Add a new page with a continuation header and return the starting Y. */
const addNewPage = (doc: jsPDF, pageNum: number): number => {
  const pageWidth  = doc.internal.pageSize.getWidth()
  const margin     = 15

  doc.addPage()

  doc.setFillColor(37, 99, 235)
  doc.rect(0, 0, pageWidth, 25, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(`Continuation - Page ${pageNum}`, margin, 17)

  return 35
}

/** Return the current Y, or add a new page and return the new starting Y. */
const checkPageBreak = (doc: jsPDF, currentY: number, requiredSpace: number, pageNum: { value: number }): number => {
  const pageHeight  = doc.internal.pageSize.getHeight()
  const footerHeight = 15

  if (currentY + requiredSpace > pageHeight - footerHeight) {
    pageNum.value++
    return addNewPage(doc, pageNum.value)
  }
  return currentY
}

/** Stamp footer on every page. */
const addFooters = (doc: jsPDF): void => {
  const pageWidth  = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin     = 15
  const total      = doc.getNumberOfPages()

  for (let i = 1; i <= total; i++) {
    doc.setPage(i)
    doc.setFontSize(9)
    doc.setTextColor(150, 150, 150)
    doc.text(`Page ${i}`, margin, pageHeight - 10)
    doc.text('© 2025 MIL MOOC', pageWidth - margin - 40, pageHeight - 10)
  }
}

const getSafeDateStamp = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// ---------------------------------------------------------------------------
// Module Completion Report
// ---------------------------------------------------------------------------

const downloadModuleCompletion = async () => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const pageWidth   = doc.internal.pageSize.getWidth()
  const pageHeight  = doc.internal.pageSize.getHeight()
  const margin      = 15
  const contentWidth = pageWidth - 2 * margin
  let currentY      = margin
  const pageNum     = { value: 1 }

  const newPage = (): void => {
    pageNum.value++
    currentY = addNewPage(doc, pageNum.value)
  }

  // Header
  doc.setFillColor(37, 99, 235)
  doc.rect(0, 0, pageWidth, 30, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Module Completion Report', margin, 20)
  doc.setTextColor(200, 200, 200)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 27)
  currentY = 45

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Module Completion Report (Last 14 Days)', margin, currentY)
  currentY += 12

  try {
    const fourteenDaysAgo = new Date()
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

    const { data: completions, error } = await supabase
      .from('module_completion')
      .select('module_id, modules(id, title, level), completed_at, user_id')
      .gte('completed_at', fourteenDaysAgo.toISOString())
      .order('completed_at', { ascending: false })

    if (error) {
      doc.setFontSize(10)
      doc.setTextColor(200, 0, 0)
      doc.text(`Error loading data: ${error.message}`, margin, currentY)
    } else if (!completions || completions.length === 0) {
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text('No module completions in the last 14 days.', margin, currentY)
    } else {
      // Group completions by module
      const moduleStats = new Map<string, { title: string; count: number; completions: { date: string; timeAgo: string }[] }>()

      completions.forEach((completion: any) => {
        const moduleId   = completion.module_id
        const moduleName = completion.modules?.title || `Module ${moduleId}`

        if (!moduleStats.has(moduleId)) {
          moduleStats.set(moduleId, { title: moduleName, count: 0, completions: [] })
        }

        const stats = moduleStats.get(moduleId)!
        stats.count++
        stats.completions.push({ date: completion.completed_at, timeAgo: getTimeAgo(completion.completed_at) })
      })

      const sortedModules = Array.from(moduleStats.values()).sort((a, b) => b.count - a.count)
      const totalCompletions = completions.length
      const avgCompletions   = (totalCompletions / sortedModules.length).toFixed(1)

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Total Completions: ${totalCompletions} students`, margin, currentY)
      currentY += 5
      doc.text(`Average per Module: ${avgCompletions} students`, margin, currentY)
      currentY += 10

      // Bar chart
      const barHeight  = 6
      const barSpacing = 12
      const maxCompletions = Math.max(...sortedModules.map(m => m.count))
      const chartWidth = contentWidth - 80

      currentY = checkPageBreak(doc, currentY, sortedModules.length * 12 + 10, pageNum)

      sortedModules.forEach((module) => {
        currentY = checkPageBreak(doc, currentY, 15, pageNum)

        const barY = currentY
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        const truncatedLabel = module.title.length > 10 ? module.title.substring(0, 10) + '...' : module.title
        doc.text(truncatedLabel, margin, barY + 2)

        doc.setDrawColor(220, 220, 220)
        doc.rect(margin + 30, barY - 2, chartWidth, barHeight)

        const filledWidth = (chartWidth * module.count) / maxCompletions
        doc.setFillColor(59, 130, 246)
        doc.rect(margin + 30, barY - 2, filledWidth, barHeight, 'F')

        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.text(`${module.count} students`, margin + 30 + chartWidth + 5, barY + 2)

        currentY = barY + barSpacing
      })

      currentY += 8

      // Detailed table
      currentY = checkPageBreak(doc, currentY, 20, pageNum)

      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('Module Details & Completion Timeline', margin, currentY)
      currentY += 7

      const drawTableHeader = () => {
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.text('Module', margin, currentY)
        doc.text('Students', margin + 40, currentY)
        doc.text('Latest Completion', margin + 70, currentY)
        currentY += 5
        doc.setDrawColor(100, 100, 100)
        doc.line(margin, currentY - 1, pageWidth - margin, currentY - 1)
        currentY += 3
      }

      drawTableHeader()

      sortedModules.forEach((module) => {
        const rowEstimate = 17 + (module.completions.length > 1 ? Math.min(module.completions.length - 1, 3) * 3.5 : 0)
        if (currentY + rowEstimate > pageHeight - 15) {
          newPage()
          drawTableHeader()
        }

        const percentage       = ((module.count / totalCompletions) * 100).toFixed(1)
        const latestCompletion = module.completions[0] ?? null
        const latestDate       = latestCompletion
          ? new Date(latestCompletion.date).toLocaleString('en-US', {
              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })
          : 'N/A'

        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(0, 0, 0)
        doc.text(module.title, margin, currentY)
        currentY += 5

        doc.setFont('helvetica', 'normal')
        doc.text(`${module.count} students`, margin + 5, currentY)
        doc.text(latestDate, margin + 70, currentY)
        currentY += 4

        doc.setFont('helvetica', 'italic')
        doc.setFontSize(8)
        doc.setTextColor(120, 120, 120)
        doc.text(`(${latestCompletion?.timeAgo ?? '-'})`, margin + 70, currentY)
        doc.setTextColor(0, 0, 0)
        currentY += 4

        doc.setFont('helvetica', 'italic')
        doc.setFontSize(8)
        doc.text(`${percentage}% of all completions`, margin + 5, currentY)
        currentY += 4

        if (module.completions.length > 1) {
          const recentCompletions = module.completions.slice(1, 4)
          doc.setFont('helvetica', 'italic')
          doc.setFontSize(7)
          doc.setTextColor(100, 100, 100)

          recentCompletions.forEach((comp, compIdx) => {
            const compDate = new Date(comp.date).toLocaleString('en-US', {
              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })
            doc.text(`  • ${compDate} (${comp.timeAgo})`, margin + 8, currentY + compIdx * 3.5)
          })

          doc.setTextColor(0, 0, 0)
          currentY += recentCompletions.length * 3.5
        }

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        currentY += 4
      })

      // Timeline summary
      currentY += 8
      currentY = checkPageBreak(doc, currentY, 30, pageNum)

      doc.setDrawColor(200, 200, 200)
      doc.line(margin, currentY, pageWidth - margin, currentY)
      currentY += 6

      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('Completion Timeline Summary', margin, currentY)
      currentY += 8

      const today = new Date()

      const lastDay = completions.filter((c: any) => {
        const diffDays = Math.ceil(Math.abs(today.getTime() - new Date(c.completed_at).getTime()) / (1000 * 60 * 60 * 24))
        return diffDays <= 1
      }).length

      const last7Days = completions.filter((c: any) => {
        const diffDays = Math.ceil(Math.abs(today.getTime() - new Date(c.completed_at).getTime()) / (1000 * 60 * 60 * 24))
        return diffDays <= 7
      }).length

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.text(`Last 24 Hours: ${lastDay} completions`, margin, currentY)
      currentY += 6
      doc.text(`Last 7 Days: ${last7Days} completions`, margin, currentY)
      currentY += 6
      doc.text(`Last 14 Days: ${completions.length} completions`, margin, currentY)
    }
  } catch (err) {
    console.error('Error generating module completion report:', err)
    doc.setTextColor(200, 0, 0)
    doc.setFontSize(10)
    doc.text(`Error: ${(err as Error).message}`, margin, currentY)
  }

  addFooters(doc)
  doc.save(`module-completion-${getSafeDateStamp()}.pdf`)
}

// ---------------------------------------------------------------------------
// Enrollment Analytics Report
// ---------------------------------------------------------------------------

const downloadEnrollment = async () => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const pageWidth   = doc.internal.pageSize.getWidth()
  const pageHeight  = doc.internal.pageSize.getHeight()
  const margin      = 15
  const contentWidth = pageWidth - 2 * margin
  let currentY      = margin

  // Header
  doc.setFillColor(37, 99, 235)
  doc.rect(0, 0, pageWidth, 30, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Enrollment Analytics Report', margin, 20)
  doc.setTextColor(200, 200, 200)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 27)
  currentY = 45

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Enrollment Analytics (Last 14 Days)', margin, currentY)
  currentY += 12

  try {
    let enrollData = props.enrollmentData as any[]

    if (!enrollData || enrollData.length === 0) {
      const fourteenDaysAgo = new Date()
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

      const { data, error } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', fourteenDaysAgo.toISOString())
        .order('created_at', { ascending: true })

      if (!error && data && data.length > 0) {
        const enrollByDate = new Map<string, number>()

        data.forEach((profile: any) => {
          const date = new Date(profile.created_at).toISOString().split('T')[0] ?? ''
          enrollByDate.set(date, (enrollByDate.get(date) ?? 0) + 1)
        })

        enrollData = Array.from(enrollByDate.entries()).map(([date, enrollments]) => ({ date, enrollments }))
      }
    }

    if (!enrollData || enrollData.length === 0) {
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text('No enrollment data available for the last 14 days.', margin, currentY)
    } else {
      const totalSignups = enrollData.reduce((sum: number, e: any) => sum + (e.enrollments || 0), 0)
      const avgSignups   = (totalSignups / enrollData.length).toFixed(1)

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Total Signups: ${totalSignups}`, margin, currentY)
      currentY += 6
      doc.text(`Average per Day: ${avgSignups}`, margin, currentY)
      currentY += 10

      // Line chart
      const chartStartY  = currentY
      const chartHeight  = 50
      const maxValue     = Math.max(...enrollData.map((e: any) => e.enrollments || 0))

      doc.setDrawColor(200, 200, 200)
      doc.rect(margin, chartStartY, contentWidth, chartHeight)

      doc.setDrawColor(230, 230, 230)
      for (let i = 0; i <= 4; i++) {
        const y = chartStartY + (i * chartHeight) / 4
        doc.line(margin, y, margin + contentWidth, y)
      }

      doc.setDrawColor(34, 197, 94)
      const pointSpacing = contentWidth / (enrollData.length - 1 || 1)
      let prevX = margin
      let prevY = chartStartY + chartHeight

      enrollData.forEach((item: any, index: number) => {
        const x = margin + index * pointSpacing
        const y = chartStartY + chartHeight - (((item.enrollments || 0) / maxValue) * chartHeight)

        if (index > 0) doc.line(prevX, prevY, x, y)

        doc.setFillColor(34, 197, 94)
        doc.circle(x, y, 1.5, 'F')

        prevX = x
        prevY = y
      })

      currentY = chartStartY + chartHeight + 10

      if (currentY + enrollData.length * 5 > pageHeight - 20) {
        doc.addPage()
        currentY = 20
      }

      // Table
      const drawEnrollHeader = () => {
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.text('Date', margin, currentY)
        doc.text('Signups', margin + 50, currentY)
        currentY += 5
        doc.setDrawColor(200, 200, 200)
        doc.line(margin, currentY, pageWidth - margin, currentY)
        currentY += 4
      }

      drawEnrollHeader()

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)

      enrollData.forEach((item: any) => {
        if (currentY + 5 > pageHeight - 15) {
          doc.addPage()
          currentY = 20
          drawEnrollHeader()
          doc.setFont('helvetica', 'normal')
        }

        const date = new Date(item.date || new Date().toISOString()).toLocaleDateString('en-US')
        doc.text(String(date), margin, currentY)
        doc.text(`${item.enrollments || 0}`, margin + 50, currentY)
        currentY += 5
      })
    }
  } catch (err) {
    console.error('Error generating enrollment report:', err)
    doc.setTextColor(200, 0, 0)
    doc.setFontSize(10)
    doc.text(`Error: ${(err as Error).message}`, margin, currentY)
  }

  addFooters(doc)
  doc.save(`enrollment-analytics-${getSafeDateStamp()}.pdf`)
}

// ---------------------------------------------------------------------------
// Course Completion Rate Report
// ---------------------------------------------------------------------------

const downloadCourseCompletion = async () => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const pageWidth   = doc.internal.pageSize.getWidth()
  const pageHeight  = doc.internal.pageSize.getHeight()
  const margin      = 15
  const contentWidth = pageWidth - 2 * margin
  let currentY      = margin
  const pageNum     = { value: 1 }

  const newPage = (): void => {
    pageNum.value++
    currentY = addNewPage(doc, pageNum.value)
  }

  // Header
  doc.setFillColor(37, 99, 235)
  doc.rect(0, 0, pageWidth, 30, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Course Completion Rate Report', margin, 20)
  doc.setTextColor(200, 200, 200)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 27)
  currentY = 45

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Course Completion Rates (Beginner & Advanced)', margin, currentY)
  currentY += 12

  try {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, created_at')

    if (profilesError) {
      doc.setFontSize(10)
      doc.setTextColor(200, 0, 0)
      doc.text(`Error loading students: ${profilesError.message}`, margin, currentY)
      addFooters(doc)
      doc.save(`course-completion-${getSafeDateStamp()}.pdf`)
      return
    }

    const { data: allModules, error: modulesError } = await supabase
      .from('modules')
      .select('id, level, is_active')
      .eq('is_active', true)

    if (modulesError) {
      doc.setFontSize(10)
      doc.setTextColor(200, 0, 0)
      doc.text(`Error loading modules: ${modulesError.message}`, margin, currentY)
      addFooters(doc)
      doc.save(`course-completion-${getSafeDateStamp()}.pdf`)
      return
    }

    const { data: completions, error } = await supabase
      .from('module_completion')
      .select('module_id, completed_at, user_id')
      .not('completed_at', 'is', null)

    if (error) {
      doc.setFontSize(10)
      doc.setTextColor(200, 0, 0)
      doc.text(`Error loading data: ${error.message}`, margin, currentY)
    } else if (!profiles || profiles.length === 0 || !allModules || allModules.length === 0) {
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text('No course completion data available.', margin, currentY)
    } else {
      const beginnerModuleIds = new Set(allModules.filter((m: any) => m.level === 'beginner').map((m: any) => String(m.id)))
      const advancedModuleIds = new Set(allModules.filter((m: any) => m.level === 'advanced').map((m: any) => String(m.id)))

      const completedByUser = new Map<string, Set<string>>()
      ;(completions || []).forEach((row: any) => {
        const userId = String(row.user_id)
        const moduleId = String(row.module_id)
        if (!completedByUser.has(userId)) completedByUser.set(userId, new Set())
        completedByUser.get(userId)!.add(moduleId)
      })

      const getYearStats = (courseLevel: 'beginner' | 'advanced') => {
        const requiredModuleIds = courseLevel === 'beginner' ? beginnerModuleIds : advancedModuleIds
        const stats = new Map<number, { enrolled: number; completed: number }>()

        profiles.forEach((profile: any) => {
          const year = new Date(profile.created_at).getFullYear()
          if (!stats.has(year)) {
            stats.set(year, { enrolled: 0, completed: 0 })
          }

          const yearStats = stats.get(year)!
          yearStats.enrolled++

          const userCompleted = completedByUser.get(String(profile.id)) || new Set<string>()
          const hasCompletedCourse =
            requiredModuleIds.size > 0 &&
            Array.from(requiredModuleIds).every((moduleId) => userCompleted.has(moduleId))

          if (hasCompletedCourse) {
            yearStats.completed++
          }
        })

        return stats
      }

      const beginnerByYear = getYearStats('beginner')
      const advancedByYear = getYearStats('advanced')

      const allYears = new Set<number>()
      beginnerByYear.forEach((_, y) => allYears.add(y))
      advancedByYear.forEach((_, y) => allYears.add(y))
      const sortedYears = Array.from(allYears).sort((a, b) => a - b)

      const totalBeginnerEnrolled = Array.from(beginnerByYear.values()).reduce((sum, year) => sum + year.enrolled, 0)
      const totalBeginnerCompleted = Array.from(beginnerByYear.values()).reduce((sum, year) => sum + year.completed, 0)
      const totalAdvancedEnrolled = Array.from(advancedByYear.values()).reduce((sum, year) => sum + year.enrolled, 0)
      const totalAdvancedCompleted = Array.from(advancedByYear.values()).reduce((sum, year) => sum + year.completed, 0)

      const renderLevelSection = (
        label: string,
        colorRgb: [number, number, number],
        byYear: Map<number, { enrolled: number; completed: number }>,
        totalEnrolled: number,
        totalCompleted: number
      ) => {
        const overallRate = totalEnrolled > 0 ? ((totalCompleted / totalEnrolled) * 100).toFixed(1) : '0.0'

        doc.setFontSize(13)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...colorRgb)
        doc.text(label, margin, currentY)
        currentY += 8

        doc.setTextColor(0, 0, 0)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(`Total Enrolled: ${totalEnrolled}`, margin, currentY)
        currentY += 5
        doc.text(`Total Completed: ${totalCompleted}`, margin, currentY)
        currentY += 5
        doc.text(`Overall Completion Rate: ${overallRate}%`, margin, currentY)
        currentY += 10

        currentY = checkPageBreak(doc, currentY, sortedYears.length * 20, pageNum)

        sortedYears.forEach((year) => {
          currentY = checkPageBreak(doc, currentY, 25, pageNum)

          const yearData = byYear.get(year)

          doc.setFontSize(11)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(0, 0, 0)
          doc.text(`Year ${year}`, margin + 5, currentY)
          currentY += 6

          if (yearData) {
            const completionRate = yearData.enrolled > 0
              ? ((yearData.completed / yearData.enrolled) * 100).toFixed(1)
              : '0.0'

            doc.setFontSize(9)
            doc.setFont('helvetica', 'normal')
            doc.text(`Students Enrolled: ${yearData.enrolled}`, margin + 10, currentY)
            currentY += 4
            doc.text(`Students Completed: ${yearData.completed}`, margin + 10, currentY)
            currentY += 4
            doc.text(`Completion Rate: ${completionRate}%`, margin + 10, currentY)
            currentY += 5

            const barWidth = contentWidth - 40
            const filledWidth = (barWidth * parseFloat(completionRate)) / 100

            doc.setDrawColor(200, 200, 200)
            doc.rect(margin + 10, currentY - 2, barWidth, 5)
            doc.setFillColor(...colorRgb)
            doc.rect(margin + 10, currentY - 2, filledWidth, 5, 'F')

            doc.setFontSize(9)
            doc.setFont('helvetica', 'bold')
            doc.text(`${completionRate}%`, margin + 10 + barWidth + 5, currentY)
            currentY += 8
          } else {
            doc.setFontSize(9)
            doc.setFont('helvetica', 'normal')
            doc.text('No students enrolled in this year', margin + 10, currentY)
            currentY += 6
          }
        })

        currentY += 6
      }

      renderLevelSection('BEGINNER COURSE', [59, 130, 246], beginnerByYear, totalBeginnerEnrolled, totalBeginnerCompleted)

      doc.setDrawColor(100, 100, 100)
      doc.line(margin, currentY, pageWidth - margin, currentY)
      currentY += 8

      renderLevelSection('ADVANCED COURSE', [139, 92, 246], advancedByYear, totalAdvancedEnrolled, totalAdvancedCompleted)

      if (currentY + 24 < pageHeight - 15) {
        const totalEnrolledCombined = totalBeginnerEnrolled + totalAdvancedEnrolled
        const totalCompletedCombined = totalBeginnerCompleted + totalAdvancedCompleted
        const combinedRate = totalEnrolledCombined > 0
          ? ((totalCompletedCombined / totalEnrolledCombined) * 100).toFixed(1)
          : '0.0'

        doc.setDrawColor(100, 100, 100)
        doc.line(margin, currentY, pageWidth - margin, currentY)
        currentY += 6

        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(0, 0, 0)
        doc.text('Overall Comparison', margin, currentY)
        currentY += 7

        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.text(`Beginner: ${totalBeginnerCompleted} completed of ${totalBeginnerEnrolled} enrolled`, margin, currentY)
        currentY += 5
        doc.text(`Advanced: ${totalAdvancedCompleted} completed of ${totalAdvancedEnrolled} enrolled`, margin, currentY)
        currentY += 5
        doc.text(`Combined Completion Rate: ${combinedRate}%`, margin, currentY)
      }
    }
  } catch (err) {
    console.error('Error generating course completion report:', err)
    doc.setTextColor(200, 0, 0)
    doc.setFontSize(10)
    doc.text(`Error: ${(err as Error).message}`, margin, currentY)
  }

  addFooters(doc)
  doc.save(`course-completion-${getSafeDateStamp()}.pdf`)
}
</script>
