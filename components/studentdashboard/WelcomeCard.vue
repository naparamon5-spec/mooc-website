<template>
  <div class="welcome-card">
    <div class="welcome-card__character">
      <img
        src="~/assets/welcome.png"
        alt="Meli"
        class="character-img"
      />
    </div>
    <div class="welcome-card__content">
      <h2 class="welcome-card__title">
        Hi! I'm Meli! Your Media and Information Literacy guide.
      </h2>
      <p class="welcome-card__body">
        Welcome to this course. I will be your companion as you explore how
        media and information shape the way we learn, communicate, and
        understand the world. In this journey, you will learn how to analyze media
        messages and become a responsible digital citizen.
      </p>
      <p class="welcome-card__tagline">
        Let us start discovering, questioning, and learning together.
      </p>
      <button
        class="welcome-card__btn"
        :disabled="isSaving"
        @click="onClickHere"
      >
        {{ isSaving ? '…' : 'Click here!' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCourseAgreement } from '~/composables/useCourseAgreement'

const emit = defineEmits<{
  openAgreement: []
}>()

const { markWelcomeClicked } = useCourseAgreement()
const isSaving = ref(false)

const onClickHere = async () => {
  const { $supabase } = useNuxtApp()
  const { data: { user } } = await $supabase.auth.getUser()
  if (!user?.id) return
  isSaving.value = true
  try {
    await markWelcomeClicked(user.id)
  } catch (e) {
    console.warn('Could not save welcome clicked (run add_welcome_clicked_at.sql?):', e)
  } finally {
    isSaving.value = false
    emit('openAgreement')
  }
}
</script>

<style scoped>
.welcome-card {
  display: flex;
  align-items: center;
  gap: 24px;
  background: #dce8f8;
  border: 1px solid #b8d0ef;
  border-radius: 12px;
  padding: 28px 32px 28px 24px;
  margin-bottom: 12px;
}

.welcome-card__character {
  flex-shrink: 0;
  width: 120px;
  display: flex;
  align-items: flex-start;
  align-self: stretch;
  margin-top: -12px;
}

.character-img {
  width: 100%;
  height: auto;
  object-fit: contain;
  display: block;
}

.welcome-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.welcome-card__title {
  font-size: 20px;
  font-weight: 700;
  color: #0d1f4e;
  margin: 0;
  line-height: 1.3;
}

.welcome-card__body {
  font-size: 16px;
  color: #1a2d5a;
  line-height: 1.6;
  margin: 0;
  text-align: justify;
}

.welcome-card__tagline {
  font-size: 16px;
  font-weight: 700;
  color: #0d1f4e;
  margin: 0;
}

.welcome-card__btn {
  align-self: center;
  margin-top: 4px;
  padding: 12px 40px;
  background-color: #001a4d;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s, transform 0.1s;
  width: fit-content;
}

.welcome-card__btn:hover:not(:disabled) {
  background-color: #002a7a;
  transform: translateY(-1px);
}

.welcome-card__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>