<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-white px-4">
    
    <!-- Loading State -->
    <div
      v-if="status === 'loading'"
      class="w-full max-w-lg bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-sky-100 text-center"
    >
      <div class="flex justify-center mb-4">
        <img src="/assets/logo.png" alt="MIL MOOC" class="h-24 w-auto object-contain" />
      </div>
      <h1 class="text-2xl font-bold text-sky-800 mb-2">Verifying your email</h1>
      <p class="text-sky-700/80">Please wait a moment...</p>
      <div class="mt-6 flex justify-center">
        <div class="h-10 w-10 rounded-full border-4 border-sky-200 border-t-sky-600 animate-spin" />
      </div>
    </div>

    <!-- Success State -->
    <div
      v-else-if="status === 'success'"
      class="w-full max-w-lg bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-sky-100 text-center"
    >
      <div class="flex justify-center mb-4">
        <img src="/assets/logo.png" alt="MIL MOOC" class="h-24 w-auto object-contain" />
      </div>
      <div class="mx-auto mb-4 h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
        <span class="text-3xl">✅</span>
      </div>
      <h1 class="text-2xl font-bold text-sky-800 mb-2">Email verified</h1>
      <p class="text-sky-700/80 mb-6">Your account has been successfully verified. You can now log in.</p>
      <button
        @click="goToLogin"
        class="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-4 py-3 font-medium shadow hover:brightness-105 transition"
      >
        Go to Login
      </button>
      <p class="mt-4 text-xs text-sky-700/70">
        You can close this tab after logging in.
      </p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="status === 'error'"
      class="w-full max-w-lg bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-sky-100 text-center"
    >
      <div class="flex justify-center mb-4">
        <img src="/assets/logo.png" alt="MIL MOOC" class="h-24 w-auto object-contain" />
      </div>
      <div class="mx-auto mb-4 h-14 w-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
        <span class="text-3xl">❌</span>
      </div>
      <h1 class="text-2xl font-bold text-sky-800 mb-2">Verification failed</h1>
      <p class="text-sky-700/80 mb-6">The link may have expired or already been used. Please try again.</p>
      <button
        @click="router.push('/login')"
        class="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-500 to-red-600 text-white px-4 py-3 font-medium shadow hover:brightness-105 transition"
      >
        Back to Login
      </button>
      <div class="mt-4 text-xs text-sky-700/70">
        If this keeps happening, request a new verification email by signing up again.
      </div>
    </div>

  </div>
</template>

<script setup>
const { $supabase: supabase } = useNuxtApp()
const router = useRouter()
const route = useRoute()

const status = ref('loading') // 'loading' | 'success' | 'error'

function parseHashParams() {
  if (import.meta.server) return null
  const rawHash = (window.location.hash || '').replace(/^#/, '')
  if (!rawHash) return null

  const params = new URLSearchParams(rawHash)
  if (!params.get('access_token')) return null

  return {
    access_token: params.get('access_token') || '',
    refresh_token: params.get('refresh_token') || '',
    type: params.get('type') || '',
  }
}

function clearHashFromUrl() {
  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
  }
}

function goToLogin() {
  router.push('/login')
}

onMounted(async () => {
  const token_hash = route.query.token_hash
  const type = route.query.type
  const hash = parseHashParams()

  // Flow 1: Normal email confirmation / magic link with hash tokens
  if (hash) {
    status.value = 'success'
    clearHashFromUrl()
    return
  }

  // Flow 2: Other OTP flows (e.g. signup) using token_hash + type
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    })

    if (!error) {
      status.value = 'success'
      await supabase.auth.signOut()
    } else {
      console.error('Verification error:', error.message)
      status.value = 'error'
    }
  } else {
    status.value = 'error'
  }
})
</script>