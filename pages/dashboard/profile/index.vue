<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <DashboardHeader :student-name="studentName" />

    <!-- Main Content -->
    <main class="w-full px-4 sm:px-6 lg:px-10 py-6 flex-grow">
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        <!-- Sidebar -->
        <aside class="xl:col-span-3 space-y-6">
          <div class="bg-white p-6 rounded-2xl shadow-sm text-center">
            <img
              src="/module/1.png"
              alt="Profile Picture"
              class="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary-300"
            />
            <h3 class="mt-4 text-xl font-semibold text-gray-800">
              {{ studentName }}
            </h3>
            <p class="text-gray-500">Student</p>
            <p class="text-gray-500 text-sm">
              Student ID:
              <span class="font-medium text-gray-700">STD123456</span>
            </p>
            <button
              class="mt-4 px-4 py-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition text-sm"
            >
              Upload New Photo
            </button>
          </div>

          <SocialMediaCard />
        </aside>

        <!-- Main Profile Content -->
        <section class="xl:col-span-9 space-y-6">
          <ProfileCard />
        </section>

      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-primary-600 text-white text-center py-4">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import DashboardHeader from "~/components/studentdashboard/DashboardHeader.vue";
import ProfileCard from "~/components/studentdashboard/ProfileCard.vue";
import SocialMediaCard from "~/components/studentdashboard/SocialMediaCard.vue";

definePageMeta({ middleware: "auth" });

useHead({
  title: "Profile - MIL MOOC",
});

const studentName = ref("Student's Name");
</script>
