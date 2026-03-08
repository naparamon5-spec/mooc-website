<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    
    <!-- Loading State -->
    <div v-if="status === 'loading'" class="text-center">
      <p class="text-gray-500 text-lg">Verifying your email...</p>
    </div>

    <!-- Success State -->
    <div v-else-if="status === 'success'" class="text-center bg-white p-10 rounded-2xl shadow-md max-w-md w-full">
      <div class="text-green-500 text-6xl mb-4">✅</div>
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Email Confirmed!</h1>
      <p class="text-gray-500 mb-6">Your account has been successfully verified. You can now log in.</p>
      <button
        @click="router.push('/login')"
        class="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl w-full transition"
      >
        Go to Login
      </button>
    </div>

    <!-- Error State -->
    <div v-else-if="status === 'error'" class="text-center bg-white p-10 rounded-2xl shadow-md max-w-md w-full">
      <div class="text-red-500 text-6xl mb-4">❌</div>
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h1>
      <p class="text-gray-500 mb-6">The link may have expired or already been used. Please try signing up again.</p>
      <button
        @click="router.push('/login')"
        class="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-xl w-full transition"
      >
        Back to Login
      </button>
    </div>

  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const router = useRouter()
const route = useRoute()

const status = ref('loading') // 'loading' | 'success' | 'error'

onMounted(async () => {
  const token_hash = route.query.token_hash
  const type = route.query.type

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    })

    if (!error) {
      status.value = 'success'
    } else {
      console.error('Verification error:', error.message)
      status.value = 'error'
    }
  } else {
    status.value = 'error'
  }
})
</script>