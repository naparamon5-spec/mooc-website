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
            v-model="profile.student_id"
            class="input readonly"
            readonly
          />
        </div>

        <div class="col-span-12 md:col-span-4">
          <label class="label">Full Name</label>
          <div v-if="!isEditing" class="input readonly">
            {{ profile.full_name }}
          </div>
          <input
            v-else
            type="text"
            v-model="profile.full_name"
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
          <label class="label">Role</label>
          <input
            type="text"
            v-model="profile.role"
            class="input readonly"
            readonly
          />
        </div>

        <div class="col-span-12 md:col-span-3">
          <label class="label">Enrollment Date</label>
          <input
            type="text"
            v-model="profile.enrollment_date"
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
            v-model="profile.language"
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
            v-model="profile.country"
            class="input editable"
          />
        </div>

        <!-- ROW 3 : 4 FIELDS -->
        <div class="col-span-12 md:col-span-3">
          <label class="label">Phone Number</label>
          <div v-if="!isEditing" class="input readonly">
            {{ profile.phone || "Not provided" }}
          </div>
          <input
            v-else
            type="text"
            v-model="profile.phone"
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
            v-model="profile.timezone"
            class="input editable"
          />
        </div>

        <div class="col-span-12 md:col-span-3">
          <label class="label">Learning Mode</label>
          <div v-if="!isEditing" class="input readonly">
            {{ profile.learning_mode }}
          </div>
          <input
            v-else
            type="text"
            v-model="profile.learning_mode"
            class="input editable"
          />
        </div>

        <div class="col-span-12 md:col-span-3">
          <label class="label">Notification Preference</label>
          <div v-if="!isEditing" class="input readonly">
            {{ profile.notification_preference }}
          </div>
          <input
            v-else
            type="text"
            v-model="profile.notification_preference"
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
            {{ profile.bio || "No bio yet" }}
          </div>
          <textarea
            v-else
            rows="4"
            v-model="profile.bio"
            class="input editable"
          />
        </div>
      </div>

      <!-- ACTIONS -->
      <div v-if="isEditing" class="mt-8 space-y-4">
        <!-- Save Message -->
        <div v-if="saveMessage" :class="['p-3 rounded text-sm', saveMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
          {{ saveMessage.text }}
        </div>
        
        <!-- Buttons -->
        <div class="text-right space-x-2">
          <button
            type="button"
            @click="cancelEditing"
            :disabled="saving"
            class="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="saveChanges"
            :disabled="saving"
            class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserProfile } from "~/composables/useUserProfile";

const { profile: userProfile, fetchUserProfile } = useUserProfile();
const { $supabase } = useNuxtApp();

const profile = ref({
  student_id: "",
  full_name: "",
  email: "",
  role: "student",
  enrollment_date: "",
  language: "EN",
  country: "PH",
  phone: "",
  timezone: "GMT+8",
  learning_mode: "Online",
  notification_preference: "Email",
  bio: "",
});

const isEditing = ref(false);
const saving = ref(false);
const saveMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null);

// Fetch user profile on mount
onMounted(async () => {
  const userData = await fetchUserProfile();
  if (userData) {
    // Format enrollment date - use enrollment_date or created_at as fallback
    let enrollmentDate = "";
    const dateToFormat = userData.enrollment_date || userData.created_at;
    if (dateToFormat) {
      try {
        enrollmentDate = new Date(dateToFormat).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (e) {
        enrollmentDate = dateToFormat;
      }
    }

    profile.value = {
      student_id: userData.student_id || "",
      full_name: userData.full_name || "",
      email: userData.email || "",
      role: userData.role || "student",
      enrollment_date: enrollmentDate,
      language: userData.language || "EN",
      country: userData.country || "PH",
      phone: userData.phone || "",
      timezone: userData.timezone || "GMT+8",
      learning_mode: userData.learning_mode || "Online",
      notification_preference: userData.notification_preference || "Email",
      bio: userData.bio || "",
    };
  }
});

const startEditing = () => {
  profile.value = { ...profile.value };
  isEditing.value = true;
};

const saveChanges = async () => {
  saving.value = true;
  saveMessage.value = null;

  try {
    const { data: { user } } = await $supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Update only editable fields
    const { error } = await $supabase
      .from('profiles')
      .update({
        full_name: profile.value.full_name,
        language: profile.value.language,
        country: profile.value.country,
        phone: profile.value.phone,
        timezone: profile.value.timezone,
        learning_mode: profile.value.learning_mode,
        notification_preference: profile.value.notification_preference,
        bio: profile.value.bio,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) throw error;

    profile.value = { ...profile.value };
    isEditing.value = false;
    saveMessage.value = { type: 'success', text: 'Profile updated successfully!' };
    
    setTimeout(() => {
      saveMessage.value = null;
    }, 3000);
  } catch (err: any) {
    console.error('Update error:', err);
    saveMessage.value = { type: 'error', text: err.message || 'Failed to update profile' };
  } finally {
    saving.value = false;
  }
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
