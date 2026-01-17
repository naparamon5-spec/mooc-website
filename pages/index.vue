<template>
  <div class="min-h-screen bg-white w-full">
    <Header />
    <main>
      <Hero />
      <FeatureCards />
      <CourseDescription />
      <div class="max-w-7xl mx-auto py-10 px-6 grid grid-cols-1 md:grid-cols-2 gap-8 ">
        <LearningOutcomes />
        <Credentials />
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'guest' })

useHead({
  title: 'MIL MOOC - Media and Information Literacy',
})
</script>
