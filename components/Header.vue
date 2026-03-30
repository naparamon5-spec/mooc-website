<template>
  <header class="bg-primary-600 text-white">
  <div class="w-full flex items-center justify-between py-3 px-3 sm:px-4 md:px-8 lg:px-12 gap-2">
      <NuxtLink to="/" class="flex items-center gap-2 min-w-0 flex-1">
        <img src="/assets/logo.png" alt="MIL MOOC" class="h-10 sm:h-12 w-auto rounded-md shadow-sm bg-white shrink-0" />
        <div class="hidden sm:block min-w-0">
          <div class="text-sm font-semibold text-white">MIL MOOC</div>
          <div class="text-xs text-white/90">Media & Information Literacy</div>
        </div>
      </NuxtLink>

  <nav class="hidden md:flex items-center gap-6">
        <NuxtLink to="/signup" class="btn-primary ml-2 font-semibold">Enroll Now</NuxtLink>
        <NuxtLink to="/login" class="text-sm text-white/90 font-medium">Log in</NuxtLink>
      </nav>

      <!-- Mobile actions -->
      <div class="md:hidden flex items-center gap-2 shrink-0">
        <NuxtLink
          to="/signup"
          class="inline-flex items-center justify-center rounded-md btn-primary px-3 py-2 text-xs font-semibold text-primary-700 whitespace-nowrap"
        >
          Enroll Now
        </NuxtLink>
        <NuxtLink
          to="/login"
          class="inline-flex items-center justify-center rounded-md border border-white/70 px-3 py-2 text-xs font-semibold text-white whitespace-nowrap"
        >
          Log in
        </NuxtLink>
      </div>

    </div>
  </header>
</template>

<script setup>
</script>
