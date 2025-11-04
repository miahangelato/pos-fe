<template>
  <div class="form-group">
    <label v-if="label" :for="id" class="block text-sm font-semibold text-slate-200 mb-3">
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>

    <div class="relative group">
      <div class="absolute left-4 top-3.5 text-blue-400 pointer-events-none" v-if="icon">
        <component :is="icon" class="w-5 h-5" />
      </div>
      <input
        :id="id"
        :type="showPassword ? 'text' : type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="[
          'w-full rounded-xl transition-all duration-200 text-base',
          type === 'password' ? 'pl-12 pr-12' : 'pl-12 pr-4',
          'bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'group-hover:bg-slate-900/60 group-hover:border-slate-600/60',
          'py-3.5 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'ring-2 ring-red-500 border-red-500 focus:ring-red-500': error,
          },
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      />

      <!-- Password toggle button -->
      <button
        v-if="type === 'password'"
        type="button"
        class="absolute right-4 top-3.5 text-slate-400 hover:text-slate-300 focus:outline-none transition-colors"
        @click="showPassword = !showPassword"
      >
        <svg
          v-if="showPassword"
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m4.753-4.753L3.596 3.596" />
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>
    </div>

    <p v-if="error" class="mt-3 text-sm text-red-400 flex items-center">
      <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      {{ error }}
    </p>
    <p v-else-if="hint" class="mt-2 text-sm text-slate-400">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  modelValue: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  id?: string
  icon?: any
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
  id: undefined,
})

defineEmits<{
  'update:modelValue': [value: string]
  blur: []
  focus: []
}>()

const showPassword = ref(false)
</script>
