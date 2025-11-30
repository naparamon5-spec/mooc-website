<template>
  <section class="hero-section">
    <div class="hero-container">
      <div class="hero-content">
        <div class="megaphone-icon">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 10L15 20v20l15 10V10z" fill="#1e3a8a"/>
            <path d="M15 20l15-10v30l-15-10V20z" fill="#3b82f6"/>
            <ellipse cx="40" cy="30" rx="8" ry="12" fill="#3b82f6" opacity="0.3"/>
            <ellipse cx="45" cy="30" rx="6" ry="10" fill="#3b82f6" opacity="0.2"/>
          </svg>
        </div>
        <div class="hero-text">
          <p class="hero-subtitle">
            WELCOME TO THE MASSIVE OPEN ONLINE COURSE FOR
          </p>
          <h1 class="hero-title">
            Media and Information Literacy
          </h1>
        </div>
        <div class="megaphone-icon">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 10L15 20v20l15 10V10z" fill="#1e3a8a"/>
            <path d="M15 20l15-10v30l-15-10V20z" fill="#3b82f6"/>
            <ellipse cx="40" cy="30" rx="8" ry="12" fill="#3b82f6" opacity="0.3"/>
            <ellipse cx="45" cy="30" rx="6" ry="10" fill="#3b82f6" opacity="0.2"/>
          </svg>
        </div>
      </div>
      <p class="hero-tagline">
        Learn to think critically, verify facts, and become a responsible digital citizen.
      </p>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.hero-section {
  padding: 4rem 1.5rem;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  position: relative;
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.megaphone-icon {
  flex-shrink: 0;
}

.hero-text {
  flex: 1;
}

.hero-subtitle {
  font-size: 0.875rem;
  color: #1e3a8a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  color: #1e3a8a;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-tagline {
  font-size: 1.25rem;
  color: #1e3a8a;
  max-width: 42rem;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 3.75rem;
  }
}

@media (max-width: 767px) {
  .hero-content {
    flex-direction: column;
  }
  
  .megaphone-icon {
    display: none;
  }
  
  .hero-title {
    font-size: 2rem;
  }
}
</style>

