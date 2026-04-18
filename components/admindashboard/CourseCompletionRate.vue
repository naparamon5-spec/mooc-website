<template>
  <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg sm:text-xl font-bold text-gray-900">Course Completion Rate</h2>
    </div>

    <div class="space-y-4">
      <div
        v-for="(item, index) in data"
        :key="index"
        class="flex items-center gap-2 sm:gap-4"
      >
        <div class="w-12 sm:w-16 text-xs sm:text-sm text-gray-600 font-medium">{{ item.year }}</div>
        <div class="flex-1 relative">
          <div class="h-7 sm:h-8 bg-gray-100 rounded-lg overflow-hidden">
            <div
              class="h-full bg-primary-600 rounded-lg transition-all duration-500 flex items-center justify-end pr-3"
              :style="{ width: item.percentage + '%' }"
            >
              <span class="text-xs font-semibold text-white">{{ item.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Array,
    default: () => [
      { year: '2026', percentage: 10 },
      { year: '2027', percentage: 20 },
      { year: '2028', percentage: 30 },
      { year: '2029', percentage: 40 }
    ]
  }
})
</script>

