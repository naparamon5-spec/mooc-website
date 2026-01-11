<template>
  <section class="py-10">
  <div class="w-full px-4 md:px-8 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card class="bg-blue-100">
        <div class="text-center">
          <h3 class="text-xl font-semibold text-primary-600 mb-1">10 modules</h3>
          <p class="text-sm text-muted">Gain competency-based skills</p>
        </div>
      </Card>

      <Card class="bg-blue-100">
        <div class="text-center">
          <h3 class="text-xl font-semibold text-primary-600 mb-1">Beginner Course</h3>
          <p class="text-sm text-muted">No prior experience required</p>
        </div>
      </Card>

      <Card class="bg-blue-100">
        <div class="text-center">
          <h3 class="text-xl font-semibold text-primary-600 mb-1">1 month to complete</h3>
          <p class="text-sm text-muted">at 2 hours a week</p>
        </div>
      </Card>

      <Card class="bg-blue-100">
        <div class="text-center">
          <h3 class="text-xl font-semibold text-primary-600 mb-1">Flexible schedule</h3>
          <p class="text-sm text-muted">Learn at your own pace</p>
        </div>
      </Card>
    </div>
  </section>
</template>

<script setup>
import Card from './Card.vue'
</script>
