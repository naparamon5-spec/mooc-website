<template>
  <div class="page-wrapper">
    <Header />
    <main>
      <Hero />
      <FeatureCards />
      <CourseDescription />
      <div class="outcomes-section">
        <LearningOutcomes />
        <Credentials />
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background-color: white;
}

.outcomes-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .outcomes-section {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

