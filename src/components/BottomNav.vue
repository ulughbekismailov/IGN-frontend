<template>
  <nav class="bottom-nav">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="nav-btn"
      :class="{ active: active === tab.id }"
      @click="$emit('change', tab.id)"
    >
      <span class="nav-icon">{{ tab.icon }}</span>
      <span class="nav-label">{{ tab.label }}</span>
      <span v-if="tab.badge" class="nav-badge">{{ tab.badge }}</span>
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboard.js'

const store = useDashboardStore()

defineProps({ active: String })
defineEmits(['change'])

const tabs = computed(() => [
  { id: 'overview',   icon: '◈',  label: 'Asosiy' },
  { id: 'materials',  icon: '🧪', label: 'Xomashyo',
    badge: store.lowStockMaterials.length || null },
  { id: 'products',   icon: '💊', label: 'Dorilar' },
  { id: 'batches',    icon: '📦', label: 'Partiyalar' },
])
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%; transform: translateX(-50%);
  width: 100%; max-width: 480px;
  height: var(--nav-h);
  display: flex;
  background: rgba(7,7,9,0.92);
  backdrop-filter: blur(24px);
  border-top: 1px solid var(--border2);
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.nav-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  border: none;
  background: transparent;
  cursor: pointer;
  position: relative;
  transition: all 0.18s;
  color: var(--txt3);
}
.nav-btn:active { transform: scale(0.9); }

.nav-icon  { font-size: 20px; transition: transform 0.18s; }
.nav-label {
  font-size: 10px;
  font-family: var(--f-display);
  letter-spacing: 0.8px;
  transition: color 0.18s;
}

.nav-btn.active .nav-icon  { transform: scale(1.18); }
.nav-btn.active .nav-label { color: var(--neon); }
.nav-btn.active::before {
  content: '';
  position: absolute;
  top: 0; left: 50%;
  transform: translateX(-50%);
  width: 36px; height: 2px;
  background: linear-gradient(90deg, var(--neon), var(--neon2));
  border-radius: 0 0 4px 4px;
  box-shadow: 0 0 10px var(--neon);
}

.nav-badge {
  position: absolute;
  top: 6px; right: calc(50% - 20px);
  min-width: 16px; height: 16px;
  background: var(--neon3);
  border-radius: 8px;
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  padding: 0 4px;
  box-shadow: 0 0 8px rgba(255,59,107,0.5);
}
</style>
