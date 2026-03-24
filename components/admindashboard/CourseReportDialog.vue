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
  const footerHeight = 10
  const maxContentHeight = pageHeight - footerHeight - margin

  let currentY = margin

  // Header on first page
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

  // Content - store original render function
  const originalRenderContent = renderContent
  
  // Wrapped render function that handles page breaks
  const renderWithPageBreaks = (doc: jsPDF, startY: number): number => {
    let y = startY
    let pageNum = 1
    
    const render = (doc: jsPDF, y: number): number => {
      return originalRenderContent(doc, y)
    }
    
    y = render(doc, y)
    
    // Footer for all pages
    const addFooter = (pageNumber: number) => {
      doc.setFontSize(9)
      doc.setTextColor(150, 150, 150)
      doc.text(`Page ${pageNumber}`, margin, pageHeight - 10)
      doc.text(`© 2025 MIL MOOC`, pageWidth - margin - 40, pageHeight - 10)
    }
    
    addFooter(1)
    return y
  }

  // Content
  doc.setTextColor(0, 0, 0)
  currentY = renderWithPageBreaks(doc, currentY)

  doc.save(filename)
}

// Helper function to add a new page with proper setup
const addNewPage = (doc: jsPDF, pageNumber: number) => {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  
  doc.addPage()
  
  // Add header on new page
  doc.setFillColor(37, 99, 235) // Blue
  doc.rect(0, 0, pageWidth, 25, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.setFont(undefined, 'bold')
  doc.text(`Page ${pageNumber}`, margin, 17)
  
  // Add footer
  doc.setFontSize(9)
  doc.setTextColor(150, 150, 150)
  doc.text(`Page ${pageNumber}`, margin, pageHeight - 10)
  doc.text(`© 2025 MIL MOOC`, pageWidth - margin - 40, pageHeight - 10)
  
  return 35 // Return Y position after header
}

// Helper to check if we need a new page
const checkPageBreak = (doc: jsPDF, currentY: number, requiredSpace: number): number => {
  const pageHeight = doc.internal.pageSize.getHeight()
  const footerHeight = 15
  
  if (currentY + requiredSpace > pageHeight - footerHeight) {
    const pageNum = doc.getNumberOfPages() + 1
    return addNewPage(doc, pageNum)
  }
  return currentY
}

const downloadModuleCompletion = async () => {
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
  let pageNum = 1

  const nuxtApp = useNuxtApp()
  const supabase = nuxtApp.$supabase

  // Helper to calculate days/weeks ago
  const getTimeAgo = (date: string): string => {
    const completionDate = new Date(date)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - completionDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    
    const weeks = Math.floor(diffDays / 7)
    if (weeks === 1) return '1 week ago'
    return `${weeks} weeks ago`
  }

  // Helper to add new page
  const newPage = () => {
    doc.addPage()
    pageNum++
    currentY = 20
  }

  // Header on first page
  doc.setFillColor(37, 99, 235)
  doc.rect(0, 0, pageWidth, 30, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont(undefined, 'bold')
  doc.text('Module Completion Report', margin, 20)
  doc.setTextColor(200, 200, 200)
  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 27)
  currentY = 45

  // Title
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont(undefined, 'bold')
  doc.text('Module Completion Report (Last 14 Days)', margin, currentY)
  currentY += 12

  try {
    // Fetch module completion data from last 14 days
    const fourteenDaysAgo = new Date()
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

    const { data: completions, error } = await supabase
      .from('module_completion')
      .select('module_id, modules(id, title, level), completed_at, user_id')
      .gte('completed_at', fourteenDaysAgo.toISOString())
      .order('completed_at', { ascending: false })

    if (error) {
      console.error('Error fetching module completions:', error)
      doc.setFontSize(10)
      doc.setTextColor(200, 0, 0)
      doc.text(`Error loading data: ${error.message}`, margin, currentY)
    } else if (!completions || completions.length === 0) {
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text('No module completions in the last 14 days.', margin, currentY)
    } else {
      // Group completions by module
      const moduleStats = new Map<string, { title: string; count: number; completions: any[] }>()

      completions.forEach((completion: any) => {
        const moduleId = completion.module_id
        const moduleName = completion.modules?.title || `Module ${moduleId}`
        
        if (!moduleStats.has(moduleId)) {
          moduleStats.set(moduleId, {
            title: moduleName,
            count: 0,
            completions: []
          })
        }

        const stats = moduleStats.get(moduleId)!
        stats.count++
        stats.completions.push({
          date: completion.completed_at,
          timeAgo: getTimeAgo(completion.completed_at)
        })
      })

      // Sort by completion count (descending)
      const sortedModules = Array.from(moduleStats.values()).sort((a, b) => b.count - a.count)

      // Summary
      const totalCompletions = completions.length
      const avgCompletions = (totalCompletions / sortedModules.length).toFixed(1)
      
      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      doc.text(`Total Completions: ${totalCompletions} students`, margin, currentY)
      currentY += 5
      doc.text(`Average per Module: ${avgCompletions} students`, margin, currentY)
      currentY += 10

      // Check page break before chart
      if (currentY + (sortedModules.length * 10) > pageHeight - 25) {
        newPage()
      }

      // Draw horizontal bar chart
      const chartStartY = currentY
      const barHeight = 6
      const barSpacing = 12
      const maxCompletions = Math.max(...sortedModules.map(m => m.count))
      const chartWidth = contentWidth - 80

      sortedModules.forEach((module, index) => {
        // Check if we need a new page
        if (currentY + 15 > pageHeight - 15) {
          newPage()
        }

        const barY = currentY
        
        // Module name
        doc.setFontSize(9)
        doc.setFont(undefined, 'normal')
        const moduleLabelWidth = doc.getStringUnitWidth(module.title) * 9 / pageWidth * contentWidth
        const truncatedLabel = moduleLabelWidth > 25 ? module.title.substring(0, 10) + '...' : module.title
        doc.text(truncatedLabel, margin, barY + 2)
        
        // Draw bar background
        doc.setDrawColor(220, 220, 220)
        doc.rect(margin + 30, barY - 2, chartWidth, barHeight)
        
        // Draw filled bar
        const filledWidth = (chartWidth * module.count) / maxCompletions
        doc.setFillColor(59, 130, 246)
        doc.rect(margin + 30, barY - 2, filledWidth, barHeight, 'F')
        
        // Draw completion count
        doc.setFontSize(9)
        doc.setFont(undefined, 'bold')
        doc.text(`${module.count} students`, margin + 30 + chartWidth + 5, barY + 2)
        
        currentY = barY + barSpacing
      })

      currentY += 8

      // Check page break before table
      if (currentY + 20 > pageHeight - 15) {
        newPage()
      }

      // Detailed table
      doc.setFontSize(11)
      doc.setFont(undefined, 'bold')
      doc.text('Module Details & Completion Timeline', margin, currentY)
      currentY += 7

      // Table headers
      doc.setFontSize(9)
      doc.setFont(undefined, 'bold')
      doc.text('Module', margin, currentY)
      doc.text('Students', margin + 40, currentY)
      doc.text('Latest Completion', margin + 70, currentY)
      currentY += 5

      // Header line
      doc.setDrawColor(100, 100, 100)
      doc.line(margin, currentY - 1, pageWidth - margin, currentY - 1)
      currentY += 3

      // Table data
      doc.setFont(undefined, 'normal')
      doc.setFontSize(9)
      sortedModules.forEach((module, index) => {
        // Check page break
        if (currentY + 15 > pageHeight - 15) {
          newPage()
          // Redraw table header
          doc.setFontSize(9)
          doc.setFont(undefined, 'bold')
          doc.text('Module', margin, currentY)
          doc.text('Students', margin + 40, currentY)
          doc.text('Latest Completion', margin + 70, currentY)
          currentY += 5
          doc.setDrawColor(100, 100, 100)
          doc.line(margin, currentY - 1, pageWidth - margin, currentY - 1)
          currentY += 3
          doc.setFont(undefined, 'normal')
          doc.setFontSize(9)
        }

        const percentage = ((module.count / totalCompletions) * 100).toFixed(1)
        const latestCompletion = module.completions[0]
        const latestDate = new Date(latestCompletion.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        
        // Module name on its own line
        doc.setFont(undefined, 'bold')
        doc.text(module.title, margin, currentY)
        currentY += 5
        
        // Stats on next line
        doc.setFont(undefined, 'normal')
        doc.text(`${module.count} students`, margin + 5, currentY)
        doc.text(`${latestDate}`, margin + 70, currentY)
        currentY += 4
        
        // Show timing info with lighter text
        doc.setFont(undefined, 'italic')
        doc.setFontSize(8)
        doc.setTextColor(120, 120, 120)
        doc.text(`(${latestCompletion.timeAgo})`, margin + 70, currentY)
        doc.setTextColor(0, 0, 0)
        currentY += 4
        
        // Percentage info
        doc.setFont(undefined, 'italic')
        doc.setFontSize(8)
        doc.text(`${percentage}% of all completions`, margin + 5, currentY)
        currentY += 4
        
        // Show last 3 completion dates
        if (module.completions.length > 1) {
          const recentCompletions = module.completions.slice(1, 4)
          doc.setFont(undefined, 'italic')
          doc.setFontSize(7)
          doc.setTextColor(100, 100, 100)
          
          recentCompletions.forEach((comp, compIdx) => {
            const compDate = new Date(comp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
            doc.text(`  • ${compDate} (${comp.timeAgo})`, margin + 8, currentY + (compIdx * 3.5))
          })
          
          doc.setTextColor(0, 0, 0)
          currentY += recentCompletions.length * 3.5
        }
        
        doc.setFont(undefined, 'normal')
        doc.setFontSize(9)
        currentY += 4
      })

      // Timeline summary section
      currentY += 8
      
      // Check if we need a new page for timeline
      if (currentY + 30 > pageHeight - 15) {
        newPage()
      }

      doc.setDrawColor(200, 200, 200)
      doc.line(margin, currentY, pageWidth - margin, currentY)
      currentY += 6
      
      doc.setFontSize(10)
      doc.setFont(undefined, 'bold')
      doc.text('Completion Timeline Summary', margin, currentY)
      currentY += 8

      // Count completions by time period
      const today = new Date()
      const lastDay = completions.filter((c: any) => {
        const d = new Date(c.completed_at)
        return Math.ceil((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)) <= 1
      }).length

      const last7Days = completions.filter((c: any) => {
        const d = new Date(c.completed_at)
        return Math.ceil((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)) <= 7
      }).length

      const last14Days = completions.length

      doc.setFont(undefined, 'normal')
      doc.setFontSize(9)
      doc.text(`Last 24 Hours: ${lastDay} completions`, margin, currentY)
      currentY += 6
      doc.text(`Last 7 Days: ${last7Days} completions`, margin, currentY)
      currentY += 6
      doc.text(`Last 14 Days: ${last14Days} completions`, margin, currentY)
    }
  } catch (err) {
    console.error('Error generating module completion report:', err)
    doc.setTextColor(200, 0, 0)
    doc.setFontSize(10)
    doc.text(`Error: ${(err as Error).message}`, margin, currentY)
  }

  // Add footer to all pages
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(9)
    doc.setTextColor(150, 150, 150)
    doc.text(`Page ${i}`, margin, pageHeight - 10)
    doc.text(`© 2025 MIL MOOC`, pageWidth - margin - 40, pageHeight - 10)
  }

  doc.save(`module-completion-${new Date().toISOString().split('T')[0]}.pdf`)
}

const downloadEnrollment = async () => {
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

  const nuxtApp = useNuxtApp()
  const supabase = nuxtApp.$supabase

  // Header
  doc.setFillColor(37, 99, 235)
  doc.rect(0, 0, pageWidth, 30, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont(undefined, 'bold')
  doc.text('Enrollment Analytics Report', margin, 20)
  doc.setTextColor(200, 200, 200)
  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 27)
  currentY = 45

  // Title
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont(undefined, 'bold')
  doc.text('Enrollment Analytics (Last 14 Days)', margin, currentY)
  currentY += 12

  try {
    // Use props data if available, otherwise try to fetch
    let enrollData = props.enrollmentData as any[]
    
    if (!enrollData || enrollData.length === 0) {
      // Try to fetch from database if available
      const fourteenDaysAgo = new Date()
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('created_at')
        .gte('created_at', fourteenDaysAgo.toISOString())
        .order('created_at', { ascending: true })

      if (!error && data && data.length > 0) {
        // Group by date
        const enrollByDate = new Map<string, number>()
        
        data.forEach((profile: any) => {
          const date = new Date(profile.created_at).toISOString().split('T')[0]
          enrollByDate.set(date, (enrollByDate.get(date) || 0) + 1)
        })

        // Convert to array
        enrollData = Array.from(enrollByDate.entries()).map(([date, enrollments]) => ({
          date,
          enrollments
        }))
      }
    }

    if (!enrollData || enrollData.length === 0) {
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text('No enrollment data available for the last 14 days.', margin, currentY)
    } else {
      // Summary
      const totalSignups = enrollData.reduce((sum, e) => sum + (e.enrollments || 0), 0)
      const avgSignups = (totalSignups / enrollData.length).toFixed(1)

      doc.setTextColor(0, 0, 0)
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
      doc.setDrawColor(34, 197, 94)
      const pointSpacing = chartWidth / (enrollData.length - 1 || 1)
      let prevX = margin
      let prevY = chartStartY + chartHeight

      enrollData.forEach((item, index) => {
        const x = margin + index * pointSpacing
        const y = chartStartY + chartHeight - (((item.enrollments || 0) / maxValue) * chartHeight)
        
        if (index > 0) {
          doc.line(prevX, prevY, x, y)
        }
        
        doc.setFillColor(34, 197, 94)
        doc.circle(x, y, 1.5, 'F')
        
        prevX = x
        prevY = y
      })

      currentY = chartStartY + chartHeight + 10

      // Check page break
      if (currentY + (enrollData.length * 5) > pageHeight - 20) {
        doc.addPage()
        currentY = 20
      }

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
        if (currentY + 5 > pageHeight - 15) {
          doc.addPage()
          currentY = 20
          // Redraw header
          doc.setFont(undefined, 'bold')
          doc.text('Date', margin, currentY)
          doc.text('Signups', margin + 50, currentY)
          currentY += 5
          doc.setDrawColor(200, 200, 200)
          doc.line(margin, currentY, pageWidth - margin, currentY)
          currentY += 4
          doc.setFont(undefined, 'normal')
        }

        const date = new Date(item.date).toLocaleDateString('en-US')
        doc.text(date, margin, currentY)
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

  // Add footer to all pages
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(9)
    doc.setTextColor(150, 150, 150)
    doc.text(`Page ${i}`, margin, pageHeight - 10)
    doc.text(`© 2025 MIL MOOC`, pageWidth - margin - 40, pageHeight - 10)
  }

  doc.save(`enrollment-analytics-${new Date().toISOString().split('T')[0]}.pdf`)
}

const downloadCourseCompletion = async () => {
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
  let pageNum = 1

  const nuxtApp = useNuxtApp()
  const supabase = nuxtApp.$supabase

  // Helper to add new page
  const newPage = () => {
    doc.addPage()
    pageNum++
    currentY = 20
    
    // Add page header
    doc.setFillColor(37, 99, 235)
    doc.rect(0, 0, pageWidth, 25, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text(`Continuation - Page ${pageNum}`, margin, 16)
    currentY = 35
  }

  // Header on first page
  doc.setFillColor(37, 99, 235)
  doc.rect(0, 0, pageWidth, 30, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont(undefined, 'bold')
  doc.text('Course Completion Rate Report', margin, 20)
  doc.setTextColor(200, 200, 200)
  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 27)
  currentY = 45

  // Title
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont(undefined, 'bold')
  doc.text('Course Completion Rates (Beginner & Advanced)', margin, currentY)
  currentY += 12

  try {
    // Fetch completion data by course level
    const { data: completions, error } = await supabase
      .from('quiz_results')
      .select('modules(level, title), completed_at, user_id')
      .eq('passed', true)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })

    if (error) {
      console.error('Error fetching course completion data:', error)
      doc.setFontSize(10)
      doc.setTextColor(200, 0, 0)
      doc.text(`Error loading data: ${error.message}`, margin, currentY)
    } else if (!completions || completions.length === 0) {
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text('No course completion data available.', margin, currentY)
    } else {
      // Separate data by course level
      const beginnerCompletions = completions.filter((c: any) => c.modules?.level === 'beginner')
      const advancedCompletions = completions.filter((c: any) => c.modules?.level === 'advanced')

      // Get unique students per level
      const beginnerStudents = new Set(beginnerCompletions.map((c: any) => c.user_id))
      const advancedStudents = new Set(advancedCompletions.map((c: any) => c.user_id))

      // Calculate completion rates by year
      const getCompletionsByYear = (completionList: any[]) => {
        const byYear = new Map<number, { count: number; students: Set<string> }>()
        
        completionList.forEach((comp: any) => {
          const year = new Date(comp.completed_at).getFullYear()
          if (!byYear.has(year)) {
            byYear.set(year, { count: 0, students: new Set() })
          }
          const yearData = byYear.get(year)!
          yearData.count++
          yearData.students.add(comp.user_id)
        })
        
        return byYear
      }

      const beginnerByYear = getCompletionsByYear(beginnerCompletions)
      const advancedByYear = getCompletionsByYear(advancedCompletions)

      // Get all years
      const allYears = new Set<number>()
      beginnerByYear.forEach((_, year) => allYears.add(year))
      advancedByYear.forEach((_, year) => allYears.add(year))
      const sortedYears = Array.from(allYears).sort((a, b) => a - b)

      // Display Beginner Course Data
      doc.setFontSize(13)
      doc.setFont(undefined, 'bold')
      doc.setTextColor(59, 130, 246) // Blue for beginner
      doc.text('═ BEGINNER COURSE ═', margin, currentY)
      currentY += 8

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      const totalBeginnerCompletions = beginnerCompletions.length
      const totalBeginnerStudents = beginnerStudents.size
      doc.text(`Total Students Completed: ${totalBeginnerStudents}`, margin, currentY)
      currentY += 5
      doc.text(`Total Module Completions: ${totalBeginnerCompletions}`, margin, currentY)
      currentY += 10

      // Check page break
      if (currentY + (sortedYears.length * 20) > pageHeight - 20) {
        newPage()
      }

      // Display beginner data by year
      sortedYears.forEach((year, yearIdx) => {
        // Check page break
        if (currentY + 25 > pageHeight - 15) {
          newPage()
        }

        const beginnerYear = beginnerByYear.get(year)
        
        doc.setFontSize(11)
        doc.setFont(undefined, 'bold')
        doc.text(`Year ${year}`, margin + 5, currentY)
        currentY += 6

        if (beginnerYear) {
          const percentage = (beginnerYear.count / totalBeginnerCompletions * 100).toFixed(1)
          doc.setFontSize(9)
          doc.setFont(undefined, 'normal')
          doc.text(`Students Completed This Year: ${beginnerYear.students.size}`, margin + 10, currentY)
          currentY += 4
          doc.text(`Module Completions: ${beginnerYear.count}`, margin + 10, currentY)
          currentY += 4
          doc.text(`Percentage of Total: ${percentage}%`, margin + 10, currentY)

          // Bar chart
          currentY += 5
          const barWidth = contentWidth - 40
          const filledWidth = (barWidth * parseFloat(percentage)) / 100
          
          doc.setDrawColor(200, 200, 200)
          doc.rect(margin + 10, currentY - 2, barWidth, 5)
          
          doc.setFillColor(59, 130, 246)
          doc.rect(margin + 10, currentY - 2, filledWidth, 5, 'F')
          
          doc.setFontSize(9)
          doc.setFont(undefined, 'bold')
          doc.text(`${percentage}%`, margin + 10 + barWidth + 5, currentY)
          
          currentY += 8
        } else {
          doc.setFontSize(9)
          doc.text('No completions in this year', margin + 10, currentY)
          currentY += 6
        }
      })

      currentY += 6

      // Separator
      doc.setDrawColor(100, 100, 100)
      doc.line(margin, currentY, pageWidth - margin, currentY)
      currentY += 8

      // Display Advanced Course Data
      doc.setFontSize(13)
      doc.setFont(undefined, 'bold')
      doc.setTextColor(139, 92, 246) // Purple for advanced
      doc.text('═ ADVANCED COURSE ═', margin, currentY)
      currentY += 8

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      const totalAdvancedCompletions = advancedCompletions.length
      const totalAdvancedStudents = advancedStudents.size
      doc.text(`Total Students Completed: ${totalAdvancedStudents}`, margin, currentY)
      currentY += 5
      doc.text(`Total Module Completions: ${totalAdvancedCompletions}`, margin, currentY)
      currentY += 10

      // Check page break
      if (currentY + (sortedYears.length * 20) > pageHeight - 20) {
        newPage()
      }

      // Display advanced data by year
      sortedYears.forEach((year, yearIdx) => {
        // Check page break
        if (currentY + 25 > pageHeight - 15) {
          newPage()
        }

        const advancedYear = advancedByYear.get(year)
        
        doc.setFontSize(11)
        doc.setFont(undefined, 'bold')
        doc.text(`Year ${year}`, margin + 5, currentY)
        currentY += 6

        if (advancedYear) {
          const percentage = (advancedYear.count / totalAdvancedCompletions * 100).toFixed(1)
          doc.setFontSize(9)
          doc.setFont(undefined, 'normal')
          doc.text(`Students Completed This Year: ${advancedYear.students.size}`, margin + 10, currentY)
          currentY += 4
          doc.text(`Module Completions: ${advancedYear.count}`, margin + 10, currentY)
          currentY += 4
          doc.text(`Percentage of Total: ${percentage}%`, margin + 10, currentY)

          // Bar chart
          currentY += 5
          const barWidth = contentWidth - 40
          const filledWidth = (barWidth * parseFloat(percentage)) / 100
          
          doc.setDrawColor(200, 200, 200)
          doc.rect(margin + 10, currentY - 2, barWidth, 5)
          
          doc.setFillColor(139, 92, 246)
          doc.rect(margin + 10, currentY - 2, filledWidth, 5, 'F')
          
          doc.setFontSize(9)
          doc.setFont(undefined, 'bold')
          doc.text(`${percentage}%`, margin + 10 + barWidth + 5, currentY)
          
          currentY += 8
        } else {
          doc.setFontSize(9)
          doc.text('No completions in this year', margin + 10, currentY)
          currentY += 6
        }
      })

      // Overall comparison
      if (currentY + 20 < pageHeight - 15) {
        currentY += 8
        doc.setDrawColor(100, 100, 100)
        doc.line(margin, currentY, pageWidth - margin, currentY)
        currentY += 6

        doc.setFontSize(11)
        doc.setFont(undefined, 'bold')
        doc.text('Overall Comparison', margin, currentY)
        currentY += 7

        doc.setFontSize(9)
        doc.setFont(undefined, 'normal')
        doc.text(`Beginner: ${totalBeginnerStudents} students | ${totalBeginnerCompletions} completions`, margin, currentY)
        currentY += 5
        doc.text(`Advanced: ${totalAdvancedStudents} students | ${totalAdvancedCompletions} completions`, margin, currentY)
        currentY += 5
        
        const totalStudents = totalBeginnerStudents + totalAdvancedStudents
        doc.text(`Total Combined: ${totalStudents} students`, margin, currentY)
      }
    }
  } catch (err) {
    console.error('Error generating course completion report:', err)
    doc.setTextColor(200, 0, 0)
    doc.setFontSize(10)
    doc.text(`Error: ${(err as Error).message}`, margin, currentY)
  }

  // Add footer to all pages
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(9)
    doc.setTextColor(150, 150, 150)
    doc.text(`Page ${i}`, margin, pageHeight - 10)
    doc.text(`© 2025 MIL MOOC`, pageWidth - margin - 40, pageHeight - 10)
  }

  doc.save(`course-completion-${new Date().toISOString().split('T')[0]}.pdf`)
}
</script>