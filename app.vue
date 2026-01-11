<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  color: var(--color-text);
  line-height: 1.6;
}

html, body {
  width: 100%;
  height: 100%;
}
</style>

<style global>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');

:root{
  --color-bg-1: #e6f4ff; /* very light blue */
  --color-bg-2: linear-gradient(180deg, #eef9ff 0%, #e6f4ff 100%);
  --color-primary: #083358; /* deep blue */
  --color-accent: #38bdf8; /* sky */
  --color-muted: #4b6b84;
  --color-text: #06385a;
  --radius: 12px;
}

html, body, #__nuxt {
  height: 100%;
}

body{
  background: var(--color-bg-2);
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
}

/* Utility tweaks for modern look */
.btn-primary{
  background: linear-gradient(90deg,var(--color-accent),#60a5fa);
  color: white;
  border-radius: 10px;
  padding: .75rem 1.15rem;
  font-weight: 600;
}

.container-max{
  max-width: 1120px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>

