<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AdminHeader :admin-name="adminName" />

    <!-- Main Content -->
    <main class="w-full px-4 sm:px-6 lg:px-10 py-6 flex-grow">
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        <!-- Sidebar -->
        <aside class="xl:col-span-3 space-y-6">
          <div class="bg-white p-6 rounded-2xl shadow-sm text-center">
            <!-- Profile Picture -->
            <div class="relative inline-block">
              <img 
                v-if="profile?.profile_pic_url" 
                :src="profile.profile_pic_url" 
                alt="Profile"
                class="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary-200"
              />
              <div 
                v-else
                class="w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-primary-300 to-primary-600 flex items-center justify-center text-white text-4xl font-bold"
              >
                {{ adminName.charAt(0) }}
              </div>
              
              <!-- Upload overlay -->
              <label 
                class="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition"
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  @change="handleProfilePicUpload"
                  class="hidden"
                />
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
            </div>

            <h3 class="mt-4 text-xl font-semibold text-gray-800">
              {{ adminName }}
            </h3>
            <p class="text-gray-500">Administrator</p>
            <p class="text-gray-500 text-sm">
              Admin ID:
              <span class="font-medium text-gray-700">{{ profile?.id?.slice(0, 8).toUpperCase() || 'Loading...' }}</span>
            </p>
            
            <!-- Upload status message -->
            <div v-if="uploadMessage" :class="['mt-4 p-2 rounded text-sm', uploadMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
              {{ uploadMessage.text }}
            </div>

            <div v-if="uploading" class="mt-4">
              <p class="text-sm text-gray-600">Uploading...</p>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div class="bg-primary-600 h-2 rounded-full w-1/2 animate-pulse"></div>
              </div>
            </div>
          </div>

          <!-- Admin Stats Card -->
          <div class="bg-white p-6 rounded-2xl shadow-sm">
            <h4 class="font-semibold text-gray-800 mb-4">Quick Stats</h4>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Total Students</span>
                <span class="font-semibold text-primary-600">{{ totalStudents }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Active Courses</span>
                <span class="font-semibold text-primary-600">{{ activeCourses }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Completion Rate</span>
                <span class="font-semibold text-primary-600">{{ completionRate }}%</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Profile Content -->
        <section class="xl:col-span-9 space-y-6">
          <!-- Admin Info Card -->
          <div class="bg-white p-6 rounded-2xl shadow-sm">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Administrator Profile</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Full Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div class="p-3 bg-gray-50 rounded-lg text-gray-800">
                  {{ adminName }}
                </div>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div class="p-3 bg-gray-50 rounded-lg text-gray-800">
                  {{ profile?.email || 'Loading...' }}
                </div>
              </div>

              <!-- Role -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <div class="p-3 bg-gray-50 rounded-lg text-gray-800">
                  Administrator
                </div>
              </div>

              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div class="p-3 bg-green-50 rounded-lg text-green-700 font-medium">
                  Active
                </div>
              </div>
            </div>

            <!-- Bio Section -->
            <!-- <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <div class="p-3 bg-gray-50 rounded-lg text-gray-800 min-h-[100px]">
                {{ profile?.bio || 'No bio added yet' }}
              </div>
            </div> -->
          </div>

          <!-- Account Activity Card -->
          <div class="bg-white p-6 rounded-2xl shadow-sm">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Account Information</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center border-b pb-3">
                <span class="text-gray-600">Account Created</span>
                <span class="text-gray-800 font-medium">{{ createdAt }}</span>
              </div>
              <div class="flex justify-between items-center border-b pb-3">
                <span class="text-gray-600">Last Login</span>
                <span class="text-gray-800 font-medium">Today</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Account ID</span>
                <span class="text-gray-800 font-medium text-sm">{{ profile?.id?.slice(0, 12) || 'Loading...' }}</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-primary-600 text-white text-center py-4">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import AdminHeader from "~/components/admindashboard/AdminHeader.vue";
import { useUserProfile } from "~/composables/useUserProfile";

definePageMeta({ middleware: "auth" });

useHead({
  title: "Admin Profile - MIL MOOC",
});

const { profile, fetchUserProfile, uploadProfilePic } = useUserProfile();

const adminName = ref("Admin User");
const uploading = ref(false);
const uploadMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null);

// Admin stats
const totalStudents = ref(1205);
const activeCourses = ref(2);
const completionRate = ref(47);

// Formatted created date
const createdAt = computed(() => {
  if (profile.value?.created_at) {
    return new Date(profile.value.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  return 'Loading...';
});

// Fetch user profile on mount
onMounted(async () => {
  const userData = await fetchUserProfile();
  if (userData?.full_name) {
    adminName.value = userData.full_name;
  }
});

// Handle profile picture upload
const handleProfilePicUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    uploadMessage.value = {
      type: 'error',
      text: 'Image must be less than 5MB'
    };
    return;
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    uploadMessage.value = {
      type: 'error',
      text: 'Please upload an image file'
    };
    return;
  }

  uploading.value = true;
  uploadMessage.value = null;

  try {
    const url = await uploadProfilePic(file);

    if (url) {
      uploadMessage.value = {
        type: 'success',
        text: 'Profile picture updated successfully!'
      };

      setTimeout(() => {
        uploadMessage.value = null;
      }, 3000);
    } else {
      uploadMessage.value = {
        type: 'error',
        text: 'Failed to upload profile picture'
      };
    }
  } catch (err) {
    uploadMessage.value = {
      type: 'error',
      text: 'An error occurred during upload'
    };
  } finally {
    uploading.value = false;
  }
};
</script>
