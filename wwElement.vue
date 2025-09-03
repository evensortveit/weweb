<template>
  <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
    <div 
      :class="[
        'h-full transition-all duration-300 ease-out rounded-full',
        variantClasses
      ]"
      :style="{ width: progressPercent }"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    progress: {
      type: Number,
      default: 0
    },
    variant: {
      type: String,
      default: 'primary'
    }
  },
  computed: {
    progressPercent() {
      const value = Math.min(100, Math.max(0, this.progress))
      return `${value}%`
    },
    variantClasses() {
      const variants = {
        primary: 'bg-blue-600',
        success: 'bg-green-600', 
        warning: 'bg-yellow-600',
        danger: 'bg-red-600'
      }
      return variants[this.variant] || variants.primary
    }
  }
}
</script>

<style scoped>
/* WeWeb compatible styles */
.w-full { width: 100%; }
.bg-gray-200 { background-color: #e5e7eb; }
.rounded-full { border-radius: 9999px; }
.h-2\.5 { height: 0.625rem; }
.overflow-hidden { overflow: hidden; }
.h-full { height: 100%; }
.transition-all { transition-property: all; }
.duration-300 { transition-duration: 300ms; }
.ease-out { transition-timing-function: cubic-bezier(0, 0, 0.2, 1); }
.bg-blue-600 { background-color: #2563eb; }
.bg-green-600 { background-color: #16a34a; }
.bg-yellow-600 { background-color: #ca8a04; }
.bg-red-600 { background-color: #dc2626; }
</style>