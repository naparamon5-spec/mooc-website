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
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
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

    <!-- Certificate Preview Modal -->
    <div
      v-if="showCertificatePreviewModal && certificatePreviewData"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2"
      @click="showCertificatePreviewModal = false"
    >
      <div
        class="bg-white rounded-lg w-full max-w-6xl h-[95vh] overflow-hidden flex flex-col"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b bg-primary-50">
          <h2 class="text-2xl font-bold text-gray-800">{{ certificatePreviewData.badgeName }}</h2>
          <button
            @click="showCertificatePreviewModal = false"
            class="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-200 rounded-full transition"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- PDF Preview -->
        <div class="flex-1 overflow-hidden bg-gray-200 p-6">
          <div class="w-full h-full bg-white rounded-lg shadow-lg">
            <CertificatePDFViewer :cert="certificatePreviewData" :student-name="studentName" />
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex gap-3 p-6 border-t bg-gray-50">
          <button
            @click="downloadCertificate(certificatePreviewData)"
            class="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition text-base"
          >
            ⬇️ Download PDF
          </button>
          <button
            @click="showCertificatePreviewModal = false"
            class="flex-1 bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition text-base"
          >
            ✕ Close
          </button>
        </div>
      </div>
    </div>

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
import CertificatePDFViewer from '~/components/CertificatePDFViewer.vue';
import { useUserProfile } from '~/composables/useUserProfile';
import { useCourseProgress } from '~/composables/useCourseProgress';
import { useCertificateTemplates } from '~/composables/useCertificateTemplates';

definePageMeta({ middleware: 'auth' });

useHead({
  title: 'My Certificates - MIL MOOC',
});

const { fetchUserProfile } = useUserProfile();
const { getAllBadges, badgeMapping, courseProgress, loadProgressFromSupabase, clearProgress } = useCourseProgress();
const { templates: certificateTemplates, fetchTemplates: fetchCertificateTemplates } = useCertificateTemplates();
const nuxtApp = useNuxtApp();
const supabase = nuxtApp.$supabase;

const studentName = ref('Student Name');
const isLoading = ref(true);
const showCertificateModal = ref(false);
const dbCertificates = ref<any[]>([]);
const showCertificatePreviewModal = ref(false);
const certificatePreviewData = ref<any>(null);

// Fetch user profile and progress on mount
onMounted(async () => {
  try {
    // Clear any previous user's progress first
    clearProgress();
    
    const userData = await fetchUserProfile();
    if (userData?.full_name) {
      studentName.value = userData.full_name;
    }

    // Load certificate templates FIRST before fetching certificates
    await fetchCertificateTemplates();
    console.log('Certificate templates loaded:', certificateTemplates.value);
    
    await loadProgressFromSupabase();
    await fetchCertificatesFromDatabase();
  } catch (err) {
    console.error('Error on mount:', err);
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
    return dbCertificates.value.map((cert) => {
      const template = certificateTemplates.value.find(t => t.course_level === cert.course_level)
      return {
        id: cert.id,
        badgeName: cert.course_level === 'beginner' 
          ? 'Media and Information Literacy (MIL) Beginner Course'
          : 'Media and Information Literacy (MIL) Advanced Course',
        courseLevel: cert.course_level,
        modulePosition: null,
        earnedAt: cert.issued_at,
        template_url: template?.template_url || null,
        description: `Successfully completed all 5 modules of the ${cert.course_level === 'beginner' ? 'Beginner' : 'Advanced'} Course`
      }
    });
  }

  // Fallback to computed certificates from progress (for display during session before save)
  const certificates: any[] = [];

  // Get beginner certificates - only if all 5 modules completed
  const beginnerBadges = getAllBadges('beginner');
  const beginnerCompleted = beginnerBadges.filter(b => b.earned).length;
  
  if (beginnerCompleted === 5) {
    const template = certificateTemplates.value.find(t => t.course_level === 'beginner')
    certificates.push({
      id: `beginner-course`,
      badgeName: 'Media and Information Literacy (MIL) Beginner Course',
      courseLevel: 'beginner',
      modulePosition: null,
      earnedAt: new Date().toISOString(),
      template_url: template?.template_url || null,
      description: 'Successfully completed all 5 modules of the Beginner Course'
    });
  }

  // Get advanced certificates - only if all 5 modules completed
  const advancedBadges = getAllBadges('advanced');
  const advancedCompleted = advancedBadges.filter(b => b.earned).length;
  
  if (advancedCompleted === 5) {
    const template = certificateTemplates.value.find(t => t.course_level === 'advanced')
    certificates.push({
      id: `advanced-course`,
      badgeName: 'Media and Information Literacy (MIL) Advanced Course',
      courseLevel: 'advanced',
      modulePosition: null,
      earnedAt: new Date().toISOString(),
      template_url: template?.template_url || null,
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

// View certificate - shows the actual PDF template with name
const viewCertificate = async (cert: any) => {
  certificatePreviewData.value = cert;
  showCertificatePreviewModal.value = true;
};

// Download certificate as PDF
const downloadCertificate = async (cert: any) => {
  try {
    console.log('Downloading certificate:', cert.id);
    
    const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
    
    // Get template for this course level
    const template = certificateTemplates.value.find(t => t.course_level === cert.courseLevel);
    if (!template?.template_url) {
      alert('Certificate template not found. Please contact support.');
      return;
    }

    console.log('Template URL:', template.template_url);

    // Fetch the PDF template
    const existingPdfBytes = await fetch(template.template_url).then(r => {
      if (!r.ok) throw new Error(`Failed to fetch PDF: ${r.status} ${r.statusText}`)
      return r.arrayBuffer()
    });

    // Load and modify PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.getPages()[0];

    // Embed font and add student name
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();

    console.log('PDF loaded, page size:', pageWidth, 'x', pageHeight);

    // Add name in center of page
    page.drawText(studentName.value, {
      x: pageWidth / 2 - (studentName.value.length * 8),
      y: pageHeight / 2,
      size: 48,
      font,
      color: rgb(0, 0, 0),
    });

    console.log('Added student name to PDF');

    // Save as PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Trigger download
    const a = document.createElement('a');
    a.href = url;
    const timestamp = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    a.download = `Certificate_${studentName.value.replace(/\s+/g, '_')}_${timestamp}.pdf`;
    a.click();

    // Clean up
    URL.revokeObjectURL(url);

    console.log('Certificate downloaded:', a.download);
  } catch (err) {
    console.error('Error downloading certificate:', err);
    alert('Failed to download certificate. Please try again or contact support.');
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
