<template>
  <div class="bg-white p-8 lg:p-10 rounded-2xl shadow-sm relative">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">
      Profile Information
    </h2>

    <button
      v-if="!isEditing"
      @click="startEditing"
      class="absolute top-6 right-6 px-5 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition"
    >
      Edit
    </button>

    <form @submit.prevent>
      <!-- 12 COLUMN GRID -->
      <div class="grid grid-cols-12 gap-6">

        <!-- ROW 1 : 3 FIELDS -->
        <div class="col-span-12 md:col-span-4">
          <label class="label">Student ID</label>
          <input
            type="text"
            v-model="profile.studentId"
            class="input readonly"
            readonly
          />
        </div>

        <div class="col-span-12 md:col-span-4">
          <label class="label">Full Name</label>
          <div v-if="!isEditing" class="input readonly">
            {{ profile.fullName }}
          </div>
          <input
            v-else
            type="text"
            v-model="editedProfile.fullName"
            class="input editable"
          />
        </div>

        <div class="col-span-12 md:col-span-4">
          <label class="label">Email</label>
          <input
            type="email"
            v-model="profile.email"
            class="input readonly"
            readonly
          />
        </div>

        <!-- ROW 2 : 4 FIELDS -->
        <div class="col-span-12 md:col-span-3">
          <label class="label">Student Level</label>
          <input
            type="text"
            v-model="profile.studentLevel"
            class="input readonly"
            readonly
          />
        </div>

        <div class="col-span-12 md:col-span-3">
          <label class="label">Enrollment Date</label>
          <input
            type="text"
            v-model="profile.enrollmentDate"
            class="input readonly"
            readonly
          />
        </div>

        <div class="col-span-12 md:col-span-3">
          <label class="label">Language</label>
          <div v-if="!isEditing" class="input readonly">
            {{ profile.language }}
          </div>
          <input
            v-else
            type="text"
            v-model="editedProfile.language"
            class="input editable"
          />
        </div>

        <div class="col-span-12 md:col-span-3">
          <label class="label">Country</label>
          <div v-if="!isEditing" class="input readonly">
            {{ profile.country }}
          </div>
          <input
            v-else
            type="text"
            v-model="editedProfile.country"
            class="input editable"
          />
        </div>

        <!-- ROW 3 : 4 FIELDS -->
        <div class="col-span-12 md:col-span-3">
          <label class="label">Phone Number</label>
          <div v-if="!isEditing" class="input readonly">
            {{ profile.phone }}
          </div>
          <input
            v-else
            type="text"
            v-model="editedProfile.phone"
            class="input editable"
          />
        </div>

        <div class="col-span-12 md:col-span-3">
          <label class="label">Time Zone</label>
          <div v-if="!isEditing" class="input readonly">
            {{ profile.timezone }}
          </div>
          <input
            v-else
            type="text"
            v-model="editedProfile.timezone"
            class="input editable"
          />
        </div>

        <div class="col-span-12 md:col-span-3">
          <label class="label">Learning Mode</label>
          <div v-if="!isEditing" class="input readonly">
            {{ profile.learningMode }}
          </div>
          <input
            v-else
            type="text"
            v-model="editedProfile.learningMode"
            class="input editable"
          />
        </div>

        <div class="col-span-12 md:col-span-3">
          <label class="label">Notification Preference</label>
          <div v-if="!isEditing" class="input readonly">
            {{ profile.notificationPreference }}
          </div>
          <input
            v-else
            type="text"
            v-model="editedProfile.notificationPreference"
            class="input editable"
          />
        </div>

        <!-- BIO FULL WIDTH -->
        <div class="col-span-12">
          <label class="label">Bio</label>
          <div
            v-if="!isEditing"
            class="input readonly min-h-[120px]"
          >
            {{ profile.bio }}
          </div>
          <textarea
            v-else
            rows="4"
            v-model="editedProfile.bio"
            class="input editable"
          />
        </div>
      </div>

      <!-- ACTIONS -->
      <div v-if="isEditing" class="mt-8 text-right space-x-2">
        <button
          type="button"
          @click="cancelEditing"
          class="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="saveChanges"
          class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const profile = ref({
  studentId: "MOOC12345",
  fullName: "Student Name",
  email: "student@example.com",
  studentLevel: "Beginner",
  enrollmentDate: "2024-01-15",
  language: "English",
  country: "Philippines",
  phone: "+63 912 345 6789",
  timezone: "GMT+8",
  learningMode: "Online",
  notificationPreference: "Email",
  bio: "Passionate about media literacy and critical thinking.",
});

const isEditing = ref(false);
const editedProfile = ref({});

const startEditing = () => {
  editedProfile.value = { ...profile.value };
  isEditing.value = true;
};

const saveChanges = () => {
  profile.value = { ...editedProfile.value };
  isEditing.value = false;
};

const cancelEditing = () => {
  isEditing.value = false;
};
</script>

<style scoped>
.label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
.input {
  @apply w-full px-4 py-2 border rounded-lg;
}
.readonly {
  @apply bg-gray-100;
}
.editable {
  @apply focus:ring-primary-500 focus:border-primary-500;
}
</style>
