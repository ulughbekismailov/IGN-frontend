<template>
  <div class="batches-view">

    <div class="list-header">
      <span class="section-title">ISHLAB CHIQARISH TARIXI</span>
      <span class="section-count">{{ store.batches.length }}</span>
    </div>

    <div v-if="store.batches.length" class="batch-list">
      <div
        v-for="(b, i) in store.batches"
        :key="b.id"
        class="batch-row"
        :style="{ animationDelay: Math.min(i * 0.04, 0.5) + 's' }"
      >
        <div class="batch-id">#{{ b.id }}</div>

        <div class="batch-info">
          <div class="batch-product truncate">{{ b.product_name }}</div>
          <div class="batch-date">{{ formatDateTime(b.produced_at) }}</div>
        </div>

        <div class="batch-right">
          <div class="batch-qty" :key="b.quantity">{{ b.quantity }}</div>
          <div class="batch-unit">DONA</div>
        </div>
      </div>
    </div>

    <div v-else class="empty">
      <span>📦</span> Hali partiya yo'q
    </div>

  </div>
</template>

<script setup>
import { useDashboardStore } from '@/stores/dashboard.js'

const store = useDashboardStore()

function formatDateTime(dt) {
  if (!dt) return ''
  const d = new Date(dt.replace(' ', 'T'))
  return d.toLocaleString('uz', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}
</script>

<style scoped>
.batches-view { display: flex; flex-direction: column; gap: 10px; }

.list-header { display: flex; align-items: center; justify-content: space-between; }
.section-title { font-family: var(--f-display); font-size: 11px; letter-spacing: 2px; color: var(--txt3); }
.section-count {
  font-size: 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 2px 8px;
  color: var(--txt2);
}

.batch-list { display: flex; flex-direction: column; gap: 7px; }

.batch-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r);
  transition: border-color 0.2s;
  animation: fadeUp 0.3s ease both;
}
.batch-row:active { transform: scale(0.98); }
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.batch-id {
  font-family: var(--f-display);
  font-size: 13px;
  color: var(--neon2);
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(0,229,201,0.08);
  border: 1px solid rgba(0,229,201,0.15);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  letter-spacing: 0;
}

.batch-info { flex: 1; min-width: 0; }
.batch-product { font-size: 13px; font-weight: 500; }
.batch-date    { font-size: 10px; color: var(--txt3); margin-top: 2px; }

.batch-right { text-align: right; flex-shrink: 0; }
.batch-qty {
  font-family: var(--f-display);
  font-size: 24px;
  color: var(--neon5);
  line-height: 1;
  animation: numPop 0.3s ease;
}
@keyframes numPop {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.1); }
  100% { transform: scale(1); }
}
.batch-unit { font-size: 9px; letter-spacing: 1.5px; color: var(--txt3); font-family: var(--f-display); }

.empty {
  text-align: center;
  color: var(--txt3);
  font-size: 13px;
  padding: 40px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
</style>
