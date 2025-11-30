<template>
  <div class="learning-outcomes">
    <div class="section-header">
      <h2 class="text-2xl font-bold text-white">What you'll learn</h2>
    </div>
    <div class="section-content">
      <div class="outcome-item">
        <div class="icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" stroke="#1e3a8a" stroke-width="2" fill="none"/>
            <circle cx="16" cy="12" r="3" fill="#1e3a8a"/>
            <path d="M10 22c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#1e3a8a" stroke-width="2"/>
            <rect x="20" y="8" width="8" height="8" rx="1" stroke="#1e3a8a" stroke-width="2" fill="none"/>
            <path d="M22 10h4M22 12h4M22 14h2" stroke="#1e3a8a" stroke-width="1.5"/>
          </svg>
        </div>
        <p class="text-dark-blue">Recognize reliable information online</p>
      </div>
      <div class="outcome-item">
        <div class="icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4L20 12L28 13L22 19L23 27L16 23L9 27L10 19L4 13L12 12L16 4Z" fill="#1e3a8a"/>
            <rect x="18" y="6" width="8" height="8" rx="1" stroke="#1e3a8a" stroke-width="2" fill="none"/>
            <path d="M20 8h4M20 10h4M20 12h2" stroke="white" stroke-width="1.5"/>
          </svg>
        </div>
        <p class="text-dark-blue">Think critically about media content</p>
      </div>
      <div class="outcome-item">
        <div class="icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12c0-2.21 1.79-4 4-4h8c2.21 0 4 1.79 4 4v8c0 2.21-1.79 4-4 4h-8c-2.21 0-4-1.79-4-4v-8z" fill="#1e3a8a"/>
            <path d="M12 16h8M12 18h6" stroke="white" stroke-width="1.5"/>
          </svg>
        </div>
        <p class="text-dark-blue">Engage responsibly in digital spaces</p>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.learning-outcomes {
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

.outcome-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.outcome-item:last-child {
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

