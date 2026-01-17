<template>
  <header class="bg-primary-600 text-white">
  <div class="w-full flex items-center justify-between py-4 px-4 md:px-8 lg:px-12">
      <NuxtLink to="/" class="flex items-center gap-3">
        <img src="/assets/logo.png" alt="MIL MOOC" class="h-12 w-auto rounded-md shadow-sm bg-white" />
        <div class="hidden sm:block">
          <div class="text-sm font-semibold text-white">MIL MOOC</div>
          <div class="text-xs text-white/90">Media & Information Literacy</div>
        </div>
      </NuxtLink>

  <nav class="hidden md:flex items-center gap-6">
        <NuxtLink to="/signup" class="btn-primary ml-2 font-semibold">Enroll Now</NuxtLink>
        <NuxtLink to="/login" class="text-sm text-white/90 font-medium">Log in</NuxtLink>
      </nav>

      <!-- Mobile menu -->
      <div class="md:hidden">
        <NuxtLink to="/signup" class="btn-primary font-semibold">Enroll Now</NuxtLink>
      </div>

    </div>
  </header>
</template>

<script setup>
</script>
