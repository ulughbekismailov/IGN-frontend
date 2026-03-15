<template>
  <div class="mat-card" :class="status">
    <div class="mat-accent" />

    <div class="mat-top">
      <div class="mat-icon-wrap" :class="status">
        {{ statusIcon }}
      </div>
      <div class="mat-body">
        <div class="mat-name truncate">{{ material.name }}</div>
        <div class="mat-unit">{{ material.unit }}</div>
      </div>
      <div class="mat-right">
        <div class="mat-stock" :class="status" :key="material.current_stock">
          {{ material.current_stock.toFixed(2) }}
        </div>
        <div class="mat-min">min: {{ material.min_stock }}</div>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="progress-wrap">
      <div class="progress-track">
        <div
          class="progress-fill"
          :class="status"
          :style="{ width: pct + '%' }"
        />
      </div>
      <div class="progress-label">
        {{ pctRaw >= 100 ? '✓ Yetarli' : pctRaw >= 50 ? 'Qisman' : 'Kam!' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ material: Object })

const pctRaw = computed(() => {
  if (props.material.min_stock <= 0) return 100
  return Math.round((props.material.current_stock / (props.material.min_stock * 2)) * 100)
})
const pct = computed(() => Math.min(Math.max(pctRaw.value, 1), 100))

const status = computed(() => {
  const m = props.material
  if (m.current_stock <= 0)          return 'empty'
  if (m.current_stock < m.min_stock) return 'low'
  if (m.current_stock < m.min_stock * 1.5) return 'warn'
  return 'ok'
})

const statusIcon = computed(() => ({
  ok: '🟢', warn: '🟡', low: '🔴', empty: '⭕',
}[status.value]))
</script>

<style scoped>
.mat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r);
  padding: 12px 14px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s, transform 0.15s;
}
.mat-card:active { transform: scale(0.98); }

/* Left accent stripe */
.mat-accent {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  border-radius: 3px 0 0 3px;
}
.ok    .mat-accent { background: var(--neon);  box-shadow: 0 0 10px rgba(57,255,133,0.5); }
.warn  .mat-accent { background: var(--neon4); box-shadow: 0 0 10px rgba(240,192,64,0.4); }
.low   .mat-accent { background: var(--neon3); box-shadow: 0 0 10px rgba(255,59,107,0.4); }
.empty .mat-accent { background: var(--txt3);  }

.ok    { border-color: rgba(57,255,133,0.12); }
.warn  { border-color: rgba(240,192,64,0.15); }
.low   { border-color: rgba(255,59,107,0.15); }
.empty { border-color: var(--border); opacity: 0.7; }

.mat-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 6px;
}

.mat-icon-wrap {
  width: 36px; height: 36px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.ok.mat-icon-wrap    { background: rgba(57,255,133,0.1); }
.warn.mat-icon-wrap  { background: rgba(240,192,64,0.1); }
.low.mat-icon-wrap   { background: rgba(255,59,107,0.1); }
.empty.mat-icon-wrap { background: var(--surface2); }

.mat-body { flex: 1; min-width: 0; }
.mat-name { font-size: 14px; font-weight: 500; }
.mat-unit { font-size: 10px; color: var(--txt3); margin-top: 1px; }

.mat-right { text-align: right; flex-shrink: 0; }
.mat-stock {
  font-family: var(--f-display);
  font-size: 20px;
  line-height: 1;
  animation: numPop 0.35s ease;
}
@keyframes numPop {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.15); }
  100% { transform: scale(1); }
}
.ok.mat-stock    { color: var(--neon); }
.warn.mat-stock  { color: var(--neon4); }
.low.mat-stock   { color: var(--neon3); }
.empty.mat-stock { color: var(--txt3); }
.mat-min { font-size: 10px; color: var(--txt3); margin-top: 2px; }

/* Progress */
.progress-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  margin-left: 6px;
}
.progress-track {
  flex: 1;
  height: 4px;
  background: var(--bg3);
  border-radius: 2px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.6s cubic-bezier(0.34,1.56,0.64,1);
}
.ok.progress-fill    { background: linear-gradient(90deg, #1a9e58, var(--neon)); }
.warn.progress-fill  { background: linear-gradient(90deg, #b87a00, var(--neon4)); }
.low.progress-fill   { background: linear-gradient(90deg, #a00026, var(--neon3)); }
.empty.progress-fill { background: var(--txt3); }
.progress-label { font-size: 9px; color: var(--txt3); white-space: nowrap; font-family: var(--f-display); letter-spacing: 0.5px; }
</style>
