<template>
  <section class="py-12 px-6">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card class="bg-blue-100 text-center">
        <template #content>
          <h3 class="text-2xl font-bold text-blue-900 mb-2">10 modules</h3>
          <p class="text-blue-900">Gain competency-based skills</p>
        </template>
      </Card>
      <Card class="bg-blue-100 text-center">
        <template #content>
          <h3 class="text-2xl font-bold text-blue-900 mb-2">Beginner Course</h3>
          <p class="text-blue-900">No prior experience required</p>
        </template>
      </Card>
      <Card class="bg-blue-100 text-center">
        <template #content>
          <h3 class="text-2xl font-bold text-blue-900 mb-2">1 month to complete</h3>
          <p class="text-blue-900">at 2 hours a week</p>
        </template>
      </Card>
      <Card class="bg-blue-100 text-center">
        <template #content>
          <h3 class="text-2xl font-bold text-blue-900 mb-2">Flexible schedule</h3>
          <p class="text-blue-900">Learn at your own pace</p>
        </template>
      </Card>
    </div>
  </section>
</template>

<script setup>
import Card from 'primevue/card'
</script>
