<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <DashboardHeader :student-name="studentName" />

    <!-- MAIN CONTENT -->
    <main class="w-full px-4 sm:px-6 lg:px-10 py-6 flex-grow">
      <div class="max-w-6xl mx-auto">
        <!-- Page Title -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">My Certificates</h1>
          <p class="text-gray-600">View and download all certificates you've earned</p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="inline-block mb-2">
            <svg class="animate-spin h-12 w-12 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p class="text-gray-600 font-semibold">Loading certificates...</p>
        </div>

        <!-- No Certificates State -->
        <div v-else-if="earnedCertificates.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">No Certificates Yet</h3>
          <p class="text-gray-500 mb-6">Complete all modules in a course to earn your certificate</p>
          <button
            @click="navigateTo('/dashboard')"
            class="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Go to Dashboard
          </button>
        </div>

        <!-- Certificates Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="cert in earnedCertificates"
            :key="cert.id"
            class="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
          >
            <!-- Certificate Preview -->
            <div class="bg-gradient-to-br from-primary-50 to-primary-100 p-8 relative border-t-4 border-primary-600">
              <!-- Badge Icon -->
              <div class="flex justify-center mb-4">
                <div class="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>

              <!-- Certificate Info -->
              <div class="text-center">
                <h3 class="text-lg font-bold text-primary-600 mb-1">{{ cert.badgeName }}</h3>
                <p class="text-sm text-gray-600 mb-3">{{ cert.courseLevel === 'beginner' ? 'Beginner Course' : 'Advanced Course' }}</p>
                <p class="text-xs text-gray-500">Earned on {{ formatDate(cert.earnedAt) }}</p>
              </div>
            </div>

            <!-- Certificate Details -->
            <div class="p-6">
              <div class="space-y-3 mb-6">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 text-sm">Modules Completed</span>
                  <span class="font-semibold text-gray-800">5 / 5</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 text-sm">Course Level</span>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    :class="cert.courseLevel === 'beginner' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'">
                    {{ cert.courseLevel === 'beginner' ? 'Beginner' : 'Advanced' }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 text-sm">Certificate ID</span>
                  <span class="font-mono text-xs text-gray-700">{{ cert.id.slice(0, 8).toUpperCase() }}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-2">
                <button
                  @click="viewCertificate(cert)"
                  class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition text-sm flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </button>
                <button
                  @click="downloadCertificate(cert)"
                  class="flex-1 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition text-sm flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Certificate Modal -->
    <CertificateModal
      :is-open="showCertificateModal"
      :student-name="studentName"
      @close="showCertificateModal = false"
      @nextCourse="handleNextCourse"
      @backToDashboard="handleBackToDashboard"
    />

    <!-- Footer -->
    <footer class="bg-primary-600 text-white text-center py-4">
      <p class="text-sm">© 2025 MIL MOOC. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import DashboardHeader from '~/components/studentdashboard/DashboardHeader.vue';
import CertificateModal from '~/components/CertificateModal.vue';
import { useUserProfile } from '~/composables/useUserProfile';
import { useCourseProgress } from '~/composables/useCourseProgress';

definePageMeta({ middleware: 'auth' });

useHead({
  title: 'My Certificates - MIL MOOC',
});

const { fetchUserProfile } = useUserProfile();
const { getAllBadges, badgeMapping, courseProgress, loadProgressFromSupabase, clearProgress } = useCourseProgress();
const nuxtApp = useNuxtApp();
const supabase = nuxtApp.$supabase;

const studentName = ref('Student Name');
const isLoading = ref(true);
const showCertificateModal = ref(false);
const dbCertificates = ref<any[]>([]);

// Fetch user profile and progress on mount
onMounted(async () => {
  try {
    // Clear any previous user's progress first
    clearProgress();
    
    const userData = await fetchUserProfile();
    if (userData?.full_name) {
      studentName.value = userData.full_name;
    }

    await loadProgressFromSupabase();
    await fetchCertificatesFromDatabase();
  } finally {
    isLoading.value = false;
  }
});

// Fetch certificates from database
const fetchCertificatesFromDatabase = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('student_id', user.id)
      .order('issued_at', { ascending: false });

    if (error) {
      console.error('Error fetching certificates:', error);
      return;
    }

    dbCertificates.value = data || [];
  } catch (err) {
    console.error('Error fetching certificates from database:', err);
  }
};

// Get all earned certificates from database
const earnedCertificates = computed(() => {
  // Use certificates from database first
  if (dbCertificates.value.length > 0) {
    return dbCertificates.value.map((cert) => ({
      id: cert.id,
      badgeName: cert.course_level === 'beginner' 
        ? 'Media and Information Literacy (MIL) Beginner Course'
        : 'Media and Information Literacy (MIL) Advanced Course',
      courseLevel: cert.course_level,
      modulePosition: null,
      earnedAt: cert.issued_at,
      description: `Successfully completed all 5 modules of the ${cert.course_level === 'beginner' ? 'Beginner' : 'Advanced'} Course`
    }));
  }

  // Fallback to computed certificates from progress (for display during session before save)
  const certificates: any[] = [];

  // Get beginner certificates - only if all 5 modules completed
  const beginnerBadges = getAllBadges('beginner');
  const beginnerCompleted = beginnerBadges.filter(b => b.earned).length;
  
  if (beginnerCompleted === 5) {
    certificates.push({
      id: `beginner-course`,
      badgeName: 'Media and Information Literacy (MIL) Beginner Course',
      courseLevel: 'beginner',
      modulePosition: null,
      earnedAt: new Date().toISOString(),
      description: 'Successfully completed all 5 modules of the Beginner Course'
    });
  }

  // Get advanced certificates - only if all 5 modules completed
  const advancedBadges = getAllBadges('advanced');
  const advancedCompleted = advancedBadges.filter(b => b.earned).length;
  
  if (advancedCompleted === 5) {
    certificates.push({
      id: `advanced-course`,
      badgeName: 'Media and Information Literacy (MIL) Advanced Course',
      courseLevel: 'advanced',
      modulePosition: null,
      earnedAt: new Date().toISOString(),
      description: 'Successfully completed all 5 modules of the Advanced Course'
    });
  }

  return certificates.sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime());
});

// Format date helper
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// View certificate
const viewCertificate = (cert: any) => {
  showCertificateModal.value = true;
};

// Download certificate
const downloadCertificate = (cert: any) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d')!;

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 1200, 800);
  gradient.addColorStop(0, '#f0f9ff');
  gradient.addColorStop(1, '#e0f2fe');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 800);

  // Border
  ctx.strokeStyle = '#0c3a66';
  ctx.lineWidth = 12;
  ctx.strokeRect(20, 20, 1160, 760);

  // Decorative corners
  ctx.fillStyle = '#0c3a66';
  const cornerSize = 30;
  ctx.fillRect(20, 20, cornerSize, 2);
  ctx.fillRect(20, 20, 2, cornerSize);
  ctx.fillRect(1180 - cornerSize, 20, cornerSize, 2);
  ctx.fillRect(1180, 20, 2, cornerSize);
  ctx.fillRect(20, 780, cornerSize, 2);
  ctx.fillRect(20, 780 - cornerSize, 2, cornerSize);
  ctx.fillRect(1180 - cornerSize, 780, cornerSize, 2);
  ctx.fillRect(1180, 780 - cornerSize, 2, cornerSize);

  // Title
  ctx.font = 'bold 48px Arial';
  ctx.fillStyle = '#083358';
  ctx.textAlign = 'center';
  ctx.fillText('Certificate of Achievement', 600, 120);

  // Badge name
  ctx.font = 'bold 36px Arial';
  ctx.fillStyle = '#0c3a66';
  ctx.fillText(cert.badgeName, 600, 190);

  // Decorative line
  ctx.strokeStyle = '#083358';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(300, 240);
  ctx.lineTo(900, 240);
  ctx.stroke();

  // Certificate text
  ctx.font = '20px Arial';
  ctx.fillStyle = '#374151';
  ctx.fillText('This certifies that', 600, 320);

  ctx.font = 'bold 36px Arial';
  ctx.fillStyle = '#083358';
  ctx.fillText(studentName.value, 600, 390);

  ctx.font = '20px Arial';
  ctx.fillStyle = '#374151';
  ctx.fillText('has successfully completed all modules of the', 600, 450);

  ctx.font = 'bold 28px Arial';
  ctx.fillStyle = '#1f2937';
  ctx.fillText(cert.badgeName, 600, 510);

  // Course level info
  ctx.font = '18px Arial';
  ctx.fillStyle = '#6b7280';
  ctx.fillText(`${cert.courseLevel === 'beginner' ? 'Beginner' : 'Advanced'} Level Course`, 600, 570);

  // Decorative line
  ctx.strokeStyle = '#083358';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(300, 620);
  ctx.lineTo(900, 620);
  ctx.stroke();

  // Date
  ctx.font = '18px Arial';
  ctx.fillStyle = '#6b7280';
  ctx.fillText(`Earned on: ${formatDate(cert.earnedAt)}`, 600, 690);

  // Certificate ID
  ctx.font = '12px Arial';
  ctx.fillStyle = '#9ca3af';
  ctx.fillText(`Certificate ID: ${cert.id.slice(0, 12).toUpperCase()}`, 600, 750);

  // Download
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = `${cert.badgeName.replace(/\s+/g, '-')}-${studentName.value.replace(/\s+/g, '-')}.png`;
  link.click();
};

// Navigation handlers
const handleNextCourse = () => {
  showCertificateModal.value = false;
  navigateTo('/dashboard?course=advanced');
};

const handleBackToDashboard = () => {
  showCertificateModal.value = false;
  navigateTo('/dashboard');
};
</script>
