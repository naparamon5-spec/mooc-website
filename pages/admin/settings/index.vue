<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AdminHeader :admin-name="adminName" />

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
import { ref, onMounted } from "vue";
import AdminHeader from "~/components/admindashboard/AdminHeader.vue";
import SecuritySettings from "~/components/studentdashboard/SecuritySettings.vue";
import NotificationSettings from "~/components/studentdashboard/NotificationSettings.vue";
import { useUserProfile } from "~/composables/useUserProfile";

definePageMeta({ middleware: "auth" });

useHead({
  title: "Admin Settings - MIL MOOC",
});

const { fetchUserProfile } = useUserProfile();
const adminName = ref("Admin User");

// Fetch user profile on mount
onMounted(async () => {
  const userData = await fetchUserProfile();
  if (userData?.full_name) {
    adminName.value = userData.full_name;
  }
});
</script>
