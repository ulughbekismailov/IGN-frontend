<template>
  <Transition name="toast">
    <div v-if="store.toastShow" class="toast">
      {{ store.toastMsg }}
    </div>
  </Transition>
</template>

<script setup>
import { useDashboardStore } from '@/stores/dashboard.js'
const store = useDashboardStore()
</script>

<style scoped>
.toast {
  position: fixed;
  top: calc(var(--header-h) + 10px);
  left: 50%; transform: translateX(-50%);
  background: rgba(57,255,133,0.12);
  border: 1px solid rgba(57,255,133,0.3);
  border-radius: 20px;
  padding: 8px 18px;
  font-size: 12px;
  font-weight: 500;
  color: var(--neon);
  backdrop-filter: blur(12px);
  z-index: 200;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 0 20px rgba(57,255,133,0.2);
}
.toast-enter-active { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from   { opacity: 0; transform: translateX(-50%) translateY(-14px); }
.toast-leave-to     { opacity: 0; transform: translateX(-50%) translateY(-8px); }
</style>
