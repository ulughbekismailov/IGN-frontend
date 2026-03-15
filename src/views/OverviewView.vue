<template>
  <div class="overview">

    <!-- Hero -->
    <div class="hero">
      <div class="hero-left">
        <div class="hero-greeting">Salom, {{ store.userName }} 👋</div>
        <div class="hero-title">DASHBOARD</div>
        <div class="hero-date">{{ dateStr }}</div>
      </div>
      <div class="hero-right">
        <div class="hero-stat">
          <div class="hero-stat-val">{{ store.stats.total_produced }}</div>
          <div class="hero-stat-label">JAMI DONA</div>
        </div>
      </div>
    </div>

    <!-- Alert banner -->
    <div v-if="store.stats.low_stock_count > 0" class="alert-banner">
      <span class="alert-icon">⚠</span>
      <span>
        <strong>{{ store.stats.low_stock_count }} ta xomashyo</strong>
        minimal me'yordan past!
      </span>
    </div>

    <!-- Stats grid -->
    <div class="stats-grid">
      <StatCard
        v-for="s in statCards"
        :key="s.label"
        :icon="s.icon"
        :value="s.value"
        :label="s.label"
        :color="s.color"
      />
    </div>

    <!-- Weekly chart -->
    <div class="section-block">
      <div class="section-hd">
        <span class="section-title">HAFTALIK ISHLAB CHIQARISH</span>
      </div>
      <div class="chart-wrap">
        <div class="bar-chart">
          <div
            v-for="d in store.weeklyChart"
            :key="d.label"
            class="bar-col"
          >
            <div class="bar-val">{{ d.val || '' }}</div>
            <div
              class="bar-body"
              :class="{ today: d.isToday }"
              :style="{ height: d.pct + 'px' }"
            />
            <div class="bar-label" :class="{ today: d.isToday }">{{ d.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top products -->
    <div v-if="store.stats.top_products?.length" class="section-block">
      <div class="section-hd">
        <span class="section-title">TOP DORILAR</span>
      </div>
      <div class="top-list">
        <div
          v-for="(p, i) in store.stats.top_products"
          :key="p.name"
          class="top-row"
          :style="{ animationDelay: i * 0.06 + 's' }"
        >
          <span class="top-rank">{{ rankIcon(i) }}</span>
          <span class="top-name truncate">{{ p.name }}</span>
          <span class="top-val">{{ p.total }} <span class="top-unit">dona</span></span>
        </div>
      </div>
    </div>

    <!-- Recent batches -->
    <div class="section-block">
      <div class="section-hd">
        <span class="section-title">SO'NGGI AMALLAR</span>
        <span class="section-count">{{ store.recentBatches.length }}</span>
      </div>
      <div v-if="store.recentBatches.length" class="activity-list">
        <div
          v-for="(b, i) in store.recentBatches"
          :key="b.id"
          class="activity-row"
          :style="{ animationDelay: i * 0.07 + 's' }"
        >
          <div class="activity-dot" />
          <div class="activity-info">
            <div class="activity-product">{{ b.product_name }}</div>
            <div class="activity-time">{{ formatTime(b.produced_at) }}</div>
          </div>
          <div class="activity-qty">{{ b.quantity }}<span class="activity-unit">д</span></div>
        </div>
      </div>
      <div v-else class="empty">
        <span>📋</span> Hali ishlab chiqarish bo'lmadi
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboard.js'
import StatCard from '@/components/StatCard.vue'

const store = useDashboardStore()

const dateStr = computed(() =>
  new Date().toLocaleDateString('uz', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
)

const statCards = computed(() => [
  { icon: '🧪', value: store.stats.materials_count, label: 'Xomashyolar', color: 'cyan' },
  { icon: '💊', value: store.stats.products_count,  label: 'Dorilar',     color: 'green' },
  { icon: '📦', value: store.stats.batches_count,   label: 'Partiyalar',  color: 'violet' },
  { icon: '⚠', value: store.stats.low_stock_count, label: 'Kam qoldiq',  color: 'pink' },
])

function rankIcon(i) {
  return i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`
}

function formatTime(dt) {
  if (!dt) return ''
  const d    = new Date(dt.replace(' ', 'T'))
  const diff = (Date.now() - d) / 1000
  if (diff < 60)    return 'Hozir'
  if (diff < 3600)  return `${Math.floor(diff / 60)} daq.`
  if (diff < 86400) return `${Math.floor(diff / 3600)} soat`
  return d.toLocaleDateString('uz', { day: 'numeric', month: 'short' })
}
</script>

<style scoped>
.overview { display: flex; flex-direction: column; gap: 12px; }

/* ── Hero ── */
.hero {
  background: var(--surface);
  border: 1px solid var(--border2);
  border-radius: var(--r-lg);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(57,255,133,0.04), transparent 60%);
  pointer-events: none;
}
.hero-greeting { font-size: 12px; color: var(--txt2); margin-bottom: 2px; }
.hero-title {
  font-family: var(--f-display);
  font-size: 34px;
  letter-spacing: 4px;
  background: linear-gradient(90deg, var(--neon), var(--neon2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}
.hero-date { font-size: 11px; color: var(--txt3); margin-top: 6px; }

.hero-stat { text-align: right; }
.hero-stat-val {
  font-family: var(--f-display);
  font-size: 42px;
  color: var(--neon);
  text-shadow: 0 0 20px rgba(57,255,133,0.45);
  line-height: 1;
}
.hero-stat-label { font-size: 9px; letter-spacing: 2px; color: var(--txt3); font-family: var(--f-display); margin-top: 2px; }

/* ── Alert ── */
.alert-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,59,107,0.08);
  border: 1px solid rgba(255,59,107,0.25);
  border-radius: var(--r-sm);
  padding: 10px 14px;
  font-size: 12px;
  color: #ff8fab;
  animation: alertPulse 3s ease-in-out infinite;
}
.alert-icon { font-size: 16px; }
@keyframes alertPulse {
  0%,100% { border-color: rgba(255,59,107,0.25); }
  50%     { border-color: rgba(255,59,107,0.5); box-shadow: 0 0 14px rgba(255,59,107,0.15); }
}

/* ── Stats grid ── */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

/* ── Section block ── */
.section-block {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r);
  padding: 14px;
}
.section-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.section-title {
  font-family: var(--f-display);
  font-size: 11px;
  letter-spacing: 2px;
  color: var(--txt3);
}
.section-count {
  font-size: 10px;
  background: var(--surface3);
  border-radius: 10px;
  padding: 2px 8px;
  color: var(--txt2);
}

/* ── Bar chart ── */
.chart-wrap { overflow: hidden; }
.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 5px;
  height: 100px;
  padding-top: 20px;
}
.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  height: 100%;
  justify-content: flex-end;
}
.bar-val { font-size: 8px; color: var(--txt3); min-height: 12px; }
.bar-body {
  width: 100%;
  border-radius: 4px 4px 2px 2px;
  background: linear-gradient(180deg, rgba(57,255,133,0.5), rgba(57,255,133,0.15));
  transition: height 0.5s cubic-bezier(0.34,1.56,0.64,1);
  min-height: 3px;
}
.bar-body.today {
  background: linear-gradient(180deg, var(--neon), rgba(57,255,133,0.4));
  box-shadow: 0 0 12px rgba(57,255,133,0.4);
}
.bar-label { font-size: 9px; color: var(--txt3); font-family: var(--f-display); letter-spacing: 0.5px; }
.bar-label.today { color: var(--neon); }

/* ── Top list ── */
.top-list { display: flex; flex-direction: column; gap: 6px; }
.top-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: var(--surface2);
  border-radius: var(--r-sm);
  border: 1px solid var(--border);
  animation: fadeUp 0.3s ease both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.top-rank { font-size: 14px; width: 22px; text-align: center; flex-shrink: 0; }
.top-name { flex: 1; font-size: 13px; font-weight: 500; }
.top-val  { font-family: var(--f-display); font-size: 16px; color: var(--neon2); }
.top-unit { font-size: 9px; color: var(--txt3); }

/* ── Activity ── */
.activity-list { display: flex; flex-direction: column; gap: 6px; }
.activity-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: var(--surface2);
  border-radius: var(--r-sm);
  border: 1px solid var(--border);
  animation: fadeUp 0.3s ease both;
}
.activity-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--neon);
  box-shadow: 0 0 8px var(--neon);
  flex-shrink: 0;
}
.activity-info { flex: 1; min-width: 0; }
.activity-product { font-size: 12px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.activity-time    { font-size: 10px; color: var(--txt3); margin-top: 1px; }
.activity-qty     { font-family: var(--f-display); font-size: 18px; color: var(--neon5); }
.activity-unit    { font-size: 10px; color: var(--txt3); }

.empty {
  text-align: center;
  color: var(--txt3);
  font-size: 13px;
  padding: 24px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
</style>
