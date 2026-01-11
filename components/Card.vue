<template>
  <div v-bind="restAttrs" :class="mergedClass">
    <!-- header slot (optional) -->
    <div v-if="$slots.header">
      <slot name="header" />
    </div>

    <!-- main content area -->
    <div :class="noPadding ? '' : 'p-6'">
      <slot name="content">
        <!-- fallback to default slot for older usages -->
        <slot />
      </slot>
    </div>
  </div>
</template>

<script setup>
import { useAttrs, computed } from 'vue'

// allow callers to disable the default inner padding when they need full-bleed content
const props = defineProps({
  noPadding: { type: Boolean, default: false }
})

const baseClasses = 'rounded-lg shadow-smsoft hover:shadow-lg transition-shadow duration-200 border border-primary-100 overflow-hidden'

const attrs = useAttrs()

const mergedClass = computed(() => {
  const cls = attrs.class || ''
  return [baseClasses, cls].filter(Boolean).join(' ')
})

const restAttrs = computed(() => {
  const { class: _c, ...rest } = attrs
  return rest
})

const noPadding = props.noPadding
</script>
