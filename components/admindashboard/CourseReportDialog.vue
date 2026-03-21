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
  isOpen:              { type: Boolean, default: false },
  moduleCompletionStats: { type: Array,   default: () => [] },
  enrollmentData:      { type: Array,     default: () => [] },
  courseCompletionRates: { type: Array,   default: () => [] }
})

defineEmits(['close'])

const generatePDF = (title: string, filename: string, renderContent: (doc: jsPDF, startY: number) => number) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  const contentWidth = pageWidth - 2 * margin

  let currentY = margin

  // Header
  doc.setFillColor(37, 99, 235) // Blue
  doc.rect(0, 0, pageWidth, 30, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont(undefined, 'bold')
  doc.text(title, margin, 20)
  
  doc.setTextColor(200, 200, 200)
  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 27)

  currentY = 45

  // Content
  doc.setTextColor(0, 0, 0)
  currentY = renderContent(doc, currentY)

  // Footer
  doc.setFontSize(9)
  doc.setTextColor(150, 150, 150)
  doc.text(`Page 1`, margin, pageHeight - 10)
  doc.text(`© 2025 MIL MOOC`, pageWidth - margin - 40, pageHeight - 10)

  doc.save(filename)
}

const downloadModuleCompletion = () => {
  generatePDF('Module Completion Report', `module-completion-${new Date().toISOString().split('T')[0]}.pdf`, (doc, startY) => {
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 15
    const contentWidth = pageWidth - 2 * margin
    let currentY = startY

    // Title
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('Module Completion (Last 14 Days)', margin, currentY)
    currentY += 12

    // Module data
    const stats = props.moduleCompletionStats as any[]

    if (stats.length === 0) {
      doc.setFontSize(10)
      doc.text('No module completion data available', margin, currentY)
      return currentY + 10
    }

    // Calculate max for percentage
    const maxCompletions = Math.max(...stats.map(m => m.completions))

    // Draw chart
    const chartStartY = currentY
    const chartHeight = 60
    
    // Draw bars
    const barWidth = contentWidth / stats.length - 2
    let barX = margin + 5
    const maxChartValue = Math.max(...stats.map(m => m.completions))

    stats.forEach((module, index) => {
      const percentage = (module.completions / maxChartValue) * 100
      const scaledHeight = (chartHeight * percentage) / 100
      
      // Draw bar
      doc.setFillColor(59, 130, 246) // Blue
      const barHeight = Math.max(scaledHeight, 2)
      doc.rect(barX, chartStartY + chartHeight - barHeight, barWidth - 1, barHeight, 'F')
      
      // Draw value
      doc.setFontSize(8)
      doc.text(`${module.completions}`, barX + barWidth / 2 - 2, chartStartY + chartHeight + 3)
      
      barX += barWidth + 1
    })

    currentY = chartStartY + chartHeight + 12

    // Legend/Table
    doc.setFontSize(9)
    doc.setFont(undefined, 'bold')
    doc.text('Module Details', margin, currentY)
    currentY += 6

    doc.setFont(undefined, 'normal')
    doc.setFontSize(8)
    stats.forEach((module, index) => {
      doc.text(`${index + 1}. ${module.title}: ${module.completions} completions`, margin + 5, currentY)
      currentY += 5
    })

    return currentY + 5
  })
}

const downloadEnrollment = () => {
  generatePDF('Enrollment Analytics Report', `enrollment-analytics-${new Date().toISOString().split('T')[0]}.pdf`, (doc, startY) => {
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 15
    const contentWidth = pageWidth - 2 * margin
    let currentY = startY

    // Title
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('Enrollment Analytics (Last 14 Days)', margin, currentY)
    currentY += 12

    const enrollData = props.enrollmentData as any[]

    if (enrollData.length === 0) {
      doc.setFontSize(10)
      doc.text('No enrollment data available', margin, currentY)
      return currentY + 10
    }

    // Summary
    const totalSignups = enrollData.reduce((sum, e) => sum + (e.enrollments || 0), 0)
    const avgSignups = (totalSignups / enrollData.length).toFixed(1)

    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.text(`Total Signups: ${totalSignups}`, margin, currentY)
    currentY += 6
    doc.text(`Average per Day: ${avgSignups}`, margin, currentY)
    currentY += 10

    // Draw line chart
    const chartStartY = currentY
    const chartWidth = contentWidth
    const chartHeight = 50
    const maxValue = Math.max(...enrollData.map(e => e.enrollments || 0))

    // Chart border
    doc.setDrawColor(200, 200, 200)
    doc.rect(margin, chartStartY, chartWidth, chartHeight)

    // Grid lines
    doc.setDrawColor(230, 230, 230)
    for (let i = 0; i <= 4; i++) {
      const y = chartStartY + (i * chartHeight) / 4
      doc.line(margin, y, margin + chartWidth, y)
    }

    // Draw lines and points
    doc.setDrawColor(34, 197, 94) // Green
    const pointSpacing = chartWidth / (enrollData.length - 1 || 1)
    let prevX = margin
    let prevY = chartStartY + chartHeight

    enrollData.forEach((item, index) => {
      const x = margin + index * pointSpacing
      const y = chartStartY + chartHeight - (((item.enrollments || 0) / maxValue) * chartHeight)
      
      // Draw line
      if (index > 0) {
        doc.line(prevX, prevY, x, y)
      }
      
      // Draw point
      doc.setFillColor(34, 197, 94)
      doc.circle(x, y, 1.5, 'F')
      
      prevX = x
      prevY = y
    })

    currentY += chartHeight + 10

    // Table header
    doc.setFont(undefined, 'bold')
    doc.setFontSize(9)
    doc.text('Date', margin, currentY)
    doc.text('Signups', margin + 50, currentY)
    currentY += 5

    doc.setDrawColor(200, 200, 200)
    doc.line(margin, currentY, pageWidth - margin, currentY)
    currentY += 4

    // Table data
    doc.setFont(undefined, 'normal')
    doc.setFontSize(9)
    enrollData.forEach(item => {
      const date = new Date(item.date).toLocaleDateString('en-US')
      doc.text(date, margin, currentY)
      doc.text(`${item.enrollments || 0}`, margin + 50, currentY)
      currentY += 5
    })

    return currentY + 5
  })
}

const downloadCourseCompletion = () => {
  generatePDF('Course Completion Rate Report', `course-completion-${new Date().toISOString().split('T')[0]}.pdf`, (doc, startY) => {
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 15
    const contentWidth = pageWidth - 2 * margin
    let currentY = startY

    // Title
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('Course Completion Rates (Year by Year)', margin, currentY)
    currentY += 12

    const rates = props.courseCompletionRates as any[]

    if (rates.length === 0) {
      doc.setFontSize(10)
      doc.text('No course completion data available', margin, currentY)
      return currentY + 10
    }

    // Sort by year
    const sortedRates = [...rates].sort((a, b) => parseInt(a.year) - parseInt(b.year))

    // Overall summary
    const avgRate = (sortedRates.reduce((sum, r) => sum + (r.completion_percentage || r.percentage || 0), 0) / sortedRates.length).toFixed(1)
    const totalEnrolled = sortedRates.reduce((sum, r) => sum + (r.total_students || 0), 0)
    const totalCompleted = sortedRates.reduce((sum, r) => sum + (r.completed_students || 0), 0)

    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.text(`Total Enrolled: ${totalEnrolled} students`, margin, currentY)
    currentY += 5
    doc.text(`Total Completed: ${totalCompleted} students`, margin, currentY)
    currentY += 5
    doc.text(`Average Completion Rate: ${avgRate}%`, margin, currentY)
    currentY += 10

    // Draw chart
    const chartStartY = currentY
    const barSpacing = 18
    const barPaddingLeft = 20
    const barWidth = contentWidth - barPaddingLeft - 40
    const maxRate = Math.max(...sortedRates.map(r => r.completion_percentage || r.percentage || 0), 20)

    sortedRates.forEach((rate, index) => {
      // Year label
      doc.setFont(undefined, 'bold')
      doc.setFontSize(10)
      doc.text(`${rate.year}:`, margin, currentY)

      // Percentage value
      const percentage = Number(rate.completion_percentage || rate.percentage || 0)
      const filledWidth = (barWidth * percentage) / maxRate

      // Bar background
      doc.setDrawColor(220, 220, 220)
      doc.rect(margin + barPaddingLeft, currentY - 3.5, barWidth, 5)

      // Color based on performance
      let fillColor = percentage < 10 ? [239, 68, 68] : percentage < 15 ? [250, 147, 51] : [34, 197, 94]
      doc.setFillColor(...fillColor)
      doc.rect(margin + barPaddingLeft, currentY - 3.5, filledWidth, 5, 'F')

      // Percentage text
      doc.setFont(undefined, 'normal')
      doc.setFontSize(9)
      doc.text(`${percentage.toFixed(1)}% (${rate.completed_students || 0}/${rate.total_students || 0})`, margin + barPaddingLeft + barWidth + 5, currentY + 1)

      currentY += barSpacing
    })

    return currentY + 5
  })
}
</script>