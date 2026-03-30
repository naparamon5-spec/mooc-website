<template>
  <div
    v-if="isVisible && isAdvancedCourse"
    class="w-full rounded-xl overflow-hidden border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 md:p-8 mb-8"
  >
    <div class="flex flex-col md:flex-row items-center gap-8">
      <div class="flex-shrink-0 w-32 h-32 md:w-48 md:h-48">
        <img
          src="~/assets/welcome.png"
          alt="Advanced course completion character"
          class="w-full h-full object-contain"
        />
      </div>

      <div class="flex-1 min-w-0">
        <h2 class="text-2xl md:text-3xl font-bold mb-4" style="color: #000000">
          Congratulations on successfully completing the
          <span class="text-blue-600 font-bold">Advanced Course in Media and Information Literacy.</span>
        </h2>

        <p class="text-gray-700 mb-4 leading-relaxed text-sm md:text-base">
          You have strengthened your ability to think critically, analyze media more deeply, and engage responsibly in digital spaces.
        </p>

        <p class="text-gray-700 mb-4 leading-relaxed text-sm md:text-base">
          As you move forward, continue applying these skills in real life by making informed decisions, evaluating information carefully, and using media with purpose and responsibility.
        </p>

        <p class="text-gray-900 mb-6 leading-relaxed text-sm md:text-base font-bold">
          Click on the certificate tab to view and download your certificates.
        </p>

        <button
          @click="handleDismiss"
          class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-base flex items-center gap-2"
        >
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const { $supabase } = useNuxtApp()

const emit = defineEmits<{
  dismissed: []
}>();

const shouldShow = ref(true);
const dismissed = ref(false);
const isAdvancedCourse = ref(false);

const isVisible = computed(() => shouldShow.value && !dismissed.value);

const updateCourseLevel = () => {
  const courseParam = route.query.course as string;
  const savedCourse = sessionStorage.getItem("activeCourseTab");
  const currentCourse = courseParam || savedCourse || "beginner";
  isAdvancedCourse.value = currentCourse === "advanced";
};

onMounted(() => {
  updateCourseLevel();
});

watch(() => route.query.course, () => {
  updateCourseLevel();
});

watch(() => sessionStorage.getItem("activeCourseTab"), () => {
  updateCourseLevel();
});

const handleDismiss = async () => {
  try {
    const { data: { user } } = await $supabase.auth.getUser()
    if (user?.id) {
      await $supabase
        .from("profiles")
        .update({ advanced_completion_card_dismissed: true })
        .eq("id", user.id)
    }
  } catch (err) {
    console.error("Error marking advanced card as dismissed:", err)
  }

  dismissed.value = true;
  emit("dismissed");
};
</script>
