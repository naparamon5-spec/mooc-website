<template>
  <section class="feature-cards">
    <div class="feature-container">
      <div class="feature-card">
        <h3 class="feature-title">10 modules</h3>
        <p class="feature-description">Gain competency-based skills</p>
      </div>
      <div class="feature-card">
        <h3 class="feature-title">Beginner Course</h3>
        <p class="feature-description">No prior experience required</p>
      </div>
      <div class="feature-card">
        <h3 class="feature-title">1 month to complete</h3>
        <p class="feature-description">at 2 hours a week</p>
      </div>
      <div class="feature-card">
        <h3 class="feature-title">Flexible schedule</h3>
        <p class="feature-description">Learn at your own pace</p>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.feature-cards {
  padding: 3rem 1.5rem;
}

.feature-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.feature-card {
  background-color: #dbeafe;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1e3a8a;
  margin-bottom: 0.5rem;
}

.feature-description {
  color: #1e3a8a;
}

@media (min-width: 768px) {
  .feature-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .feature-container {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>

