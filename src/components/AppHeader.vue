<template>
  <header class="header">
    <div class="left">
      <div class="logo-badge">⚗</div>
      <div>
        <div class="brand">PHARMACITY</div>
        <div class="user">{{ store.userName }}</div>
      </div>
    </div>
    <div class="right">
      <div class="live-pill">
        <span class="dot" />
        LIVE
      </div>
      <div class="time">{{ timeStr }}</div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard.js'

const store = useDashboardStore()
const timeStr = ref('')

let timer
function tick() {
  const d = new Date()
  timeStr.value = d.toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => { tick(); timer = setInterval(tick, 10000) })
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.header {
  height: var(--header-h);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: rgba(7,7,9,0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border2);
  flex-shrink: 0;
  position: relative;
  z-index: 10;
}

.left  { display: flex; align-items: center; gap: 10px; }
.right { display: flex; align-items: center; gap: 10px; }

.logo-badge {
  width: 38px; height: 38px;
  background: linear-gradient(135deg, var(--neon), var(--neon2));
  border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
  box-shadow: 0 0 18px rgba(57,255,133,0.35);
  flex-shrink: 0;
}

.brand {
  font-family: var(--f-display);
  font-size: 18px;
  letter-spacing: 3px;
  background: linear-gradient(90deg, var(--neon), var(--neon2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
}
.user  { font-size: 11px; color: var(--txt3); margin-top: 1px; }

.live-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(57,255,133,0.1);
  border: 1px solid rgba(57,255,133,0.22);
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 10px;
  font-family: var(--f-display);
  letter-spacing: 1.5px;
  color: var(--neon);
}
.dot {
  width: 6px; height: 6px;
  background: var(--neon);
  border-radius: 50%;
  box-shadow: 0 0 6px var(--neon);
  animation: blink 2s ease-in-out infinite;
}
@keyframes blink {
  0%,100% { opacity: 1; }
  50%     { opacity: 0.3; }
}
.time { font-size: 12px; color: var(--txt3); font-family: var(--f-display); letter-spacing: 1px; }
</style>
