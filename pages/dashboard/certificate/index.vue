<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <DashboardHeader :student-name="studentName" />

    <!-- MAIN CONTENT -->
    <main class="w-full px-4 sm:px-6 lg:px-10 py-6 flex-grow">
      <div class="mx-auto">
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
                <img src="/assets/logo.png" alt="MIL MOOC" class="h-16 w-20border-primary-600" />
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

// Download certificate as PDF
const downloadCertificate = async (cert: any) => {
  const { jsPDF } = await import('jspdf');
  const html2canvas = (await import('html2canvas')).default;

  // Create a temporary div with certificate content
  const tempDiv = document.createElement('div');
  tempDiv.style.width = '8.5in';
  tempDiv.style.height = '11in';
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '0';
  tempDiv.style.backgroundColor = '#f0f9ff';
  tempDiv.style.padding = '40px';
  tempDiv.style.fontFamily = 'Arial, sans-serif';
  tempDiv.style.boxSizing = 'border-box';
  tempDiv.style.border = '8px solid #0c3a66';

  tempDiv.innerHTML = `
    <div style="text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center;">
      <div style="margin-bottom: 30px;">
        <div style="width: 80px; height: 80px; background: linear-gradient(to bottom right, #0c3a66, #0a2d52); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
          <svg style="width: 40px; height: 40px; color: white;" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </div>

      <h1 style="font-size: 36px; color: #083358; margin: 0 0 10px 0; font-weight: bold;">Certificate of Achievement</h1>
      
      <h2 style="font-size: 24px; color: #0c3a66; margin: 0 0 20px 0; font-weight: bold;">${cert.badgeName}</h2>

      <div style="width: 200px; height: 2px; background: linear-gradient(to right, transparent, #083358, transparent); margin: 0 auto 30px;"></div>

      <p style="font-size: 16px; color: #374151; margin: 0 0 10px 0;">This certifies that</p>

      <h3 style="font-size: 28px; color: #083358; margin: 0 0 15px 0; font-weight: bold;">${studentName.value}</h3>

      <p style="font-size: 16px; color: #374151; margin: 0 0 5px 0;">has successfully completed all modules of the</p>

      <p style="font-size: 18px; color: #1f2937; margin: 0 0 20px 0; font-weight: bold;">${cert.badgeName}</p>

      <p style="font-size: 14px; color: #6b7280; margin: 0 0 30px 0;">${cert.courseLevel === 'beginner' ? 'Beginner' : 'Advanced'} Level Course</p>

      <div style="width: 200px; height: 2px; background: linear-gradient(to right, transparent, #083358, transparent); margin: 0 auto 30px;"></div>

      <p style="font-size: 14px; color: #6b7280; margin: 0 0 10px 0;">Earned on: <strong>${formatDate(cert.earnedAt)}</strong></p>

      <p style="font-size: 11px; color: #9ca3af; margin: 0;">Certificate ID: ${cert.id.slice(0, 12).toUpperCase()}</p>
    </div>
  `;

  document.body.appendChild(tempDiv);

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#f0f9ff'
    });

    // Create PDF from canvas (A4 size)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Download PDF
    const fileName = `${cert.badgeName.replace(/\s+/g, '-')}-${studentName.value.replace(/\s+/g, '-')}.pdf`;
    pdf.save(fileName);
  } finally {
    // Clean up temporary div
    document.body.removeChild(tempDiv);
  }
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
