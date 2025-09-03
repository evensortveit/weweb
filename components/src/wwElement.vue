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
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'ProgressBar',
  props: {
    progress: {
      type: Number,
      required: true,
      validator: (value) => value >= 0 && value <= 100
    },
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'success', 'warning', 'danger'].includes(value)
    }
  },
  setup(props) {
    const progressPercent = computed(() => `${Math.min(100, Math.max(0, props.progress))}%`)
    
    const variantClasses = computed(() => {
      const variants = {
        primary: 'bg-blue-600',
        success: 'bg-green-600',
        warning: 'bg-yellow-600',
        danger: 'bg-red-600'
      }
      return variants[props.variant]
    })

    return {
      progressPercent,
      variantClasses
    }
  }
})
</script>