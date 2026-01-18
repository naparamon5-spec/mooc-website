<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <DashboardHeader :student-name="studentName" />

    <!-- MAIN CONTENT (MAX WIDTH) -->
    <main class="w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-6 flex-grow">
      <div class="grid grid-cols-12 gap-6">

        <!-- FULL WIDTH CONTENT -->
        <section class="col-span-12 space-y-6">
          <SecuritySettings />
          <NotificationSettings />
        </section>

      </div>
    </main>

    <!-- FOOTER -->
    <footer class="bg-primary-600 text-white text-center py-4">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import DashboardHeader from "~/components/studentdashboard/DashboardHeader.vue";
import SecuritySettings from "~/components/studentdashboard/SecuritySettings.vue";
import NotificationSettings from "~/components/studentdashboard/NotificationSettings.vue";

definePageMeta({ middleware: "auth" });

useHead({
  title: "Profile - MIL MOOC",
});

const studentName = ref("Student's Name");
</script>
