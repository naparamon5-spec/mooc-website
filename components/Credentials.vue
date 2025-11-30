<template>
  <div class="credentials">
    <div class="section-header">
      <h2 class="text-2xl font-bold text-white">Earn recognized credentials</h2>
    </div>
    <div class="section-content">
      <div class="credential-item">
        <div class="icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4L20 8L26 6L24 12L28 16L22 18L20 24L16 20L12 24L10 18L4 16L8 12L6 6L12 8L16 4Z" fill="#1e3a8a"/>
            <circle cx="16" cy="16" r="4" fill="white"/>
          </svg>
        </div>
        <p class="text-dark-blue">Collect 10 badges</p>
      </div>
      <div class="credential-item">
        <div class="icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="6" width="16" height="20" rx="2" stroke="#1e3a8a" stroke-width="2" fill="none"/>
            <path d="M12 10h8M12 14h8M12 18h6" stroke="#1e3a8a" stroke-width="1.5"/>
            <path d="M14 22h4" stroke="#1e3a8a" stroke-width="1.5"/>
          </svg>
        </div>
        <p class="text-dark-blue">Earn your certificate of completion</p>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.credentials {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  background-color: #1e3a8a;
  padding: 1.5rem;
  text-align: center;
}

.section-content {
  padding: 2rem;
}

.credential-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.credential-item:last-child {
  margin-bottom: 0;
}

.icon {
  flex-shrink: 0;
}

.text-dark-blue {
  color: #1e3a8a;
  font-size: 1.1rem;
}
</style>

