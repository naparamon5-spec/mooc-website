<template>
  <header class="header">
    <div class="header-container">
      <div class="logo-section">
        <div class="logo-icon">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="6" width="16" height="20" rx="2" stroke="#1e3a8a" stroke-width="2" fill="none"/>
            <path d="M12 10h8M12 14h8M12 18h6" stroke="#1e3a8a" stroke-width="1.5"/>
            <rect x="20" y="12" width="12" height="16" rx="2" stroke="#1e3a8a" stroke-width="2" fill="none"/>
            <circle cx="26" cy="18" r="2" fill="#1e3a8a"/>
            <path d="M24 22h4" stroke="#1e3a8a" stroke-width="1.5"/>
          </svg>
        </div>
        <span class="logo-text">MIL MOOC</span>
      </div>
      <nav class="nav">
        <button class="btn-login">Log In</button>
        <button class="btn-enroll">Enroll for free</button>
      </nav>
    </div>
  </header>
</template>

<script setup>
</script>

<style scoped>
.header {
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1e3a8a;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-login {
  padding: 0.5rem 1.5rem;
  color: #1e3a8a;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-login:hover {
  opacity: 0.8;
}

.btn-enroll {
  padding: 0.5rem 1.5rem;
  background-color: #1e3a8a;
  color: white;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-enroll:hover {
  opacity: 0.9;
}
</style>

