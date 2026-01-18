<template>
  <div class="bg-white p-6 rounded-lg shadow-sm">
    <h2 class="text-xl font-bold text-gray-800 mb-4">Notification Settings</h2>
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <span class="text-gray-700">Email Notifications</span>
        <label class="switch">
          <input type="checkbox" v-model="notifications.email">
          <span class="slider round"></span>
        </label>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-gray-700">Push Notifications</span>
        <label class="switch">
          <input type="checkbox" v-model="notifications.push">
          <span class="slider round"></span>
        </label>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-gray-700">Weekly Newsletter</span>
        <label class="switch">
          <input type="checkbox" v-model="notifications.newsletter">
          <span class="slider round"></span>
        </label>
      </div>
    </div>
    <div class="mt-6 text-right">
      <button @click="saveSettings" class="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">Save Settings</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const notifications = ref({
  email: true,
  push: false,
  newsletter: true,
})

const saveSettings = () => {
  // Add logic to save notification settings
  console.log("Notification settings saved:", notifications.value)
}
</script>

<style scoped>
/* Basic toggle switch styles */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
