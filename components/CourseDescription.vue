<template>
  <section class="py-2">
    <!-- make card full-bleed so it uses the whole viewport width -->
    <div class="w-full px-2 md:px-8 lg:px-12">
      <Card noPadding class="bg-blue-100 w-full p-6">
        <!-- increase inner padding for comfortable reading on wide screens -->
        <div class="text-primary-600 space-y-6 px-2 md:px-10 lg:px-10 max-w-none">
          <p>
            Welcome to the MIL MOOC, a self-paced course that will help you understand how media works, how information flows, and how to navigate the digital world with clarity and responsibility.
          </p>
          <p>
            The MIL MOOC guides you through essential skills for navigating today's digital world while keeping the experience simple, engaging, and supportive. Each unit is designed to be completed in approximately 60 minutes, enabling participants to advance their MIL competencies at their own pace.
          </p>
        </div>
      </Card>
    </div>
  </section>
</template>

<script setup>
import Card from './Card.vue'
</script>
