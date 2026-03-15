<template>
  <div class="materials-view">

    <!-- Search -->
    <div class="search-box">
      <span class="search-ic">🔍</span>
      <input
        v-model="query"
        class="search-input"
        placeholder="Xomashyo nomini qidiring..."
      />
      <span v-if="query" class="search-clear" @click="query = ''">✕</span>
    </div>

    <!-- Filter pills -->
    <div class="filter-row">
      <button
        v-for="f in filters"
        :key="f.id"
        class="filter-btn"
        :class="{ active: activeFilter === f.id }"
        @click="activeFilter = f.id"
      >
        {{ f.label }}
        <span v-if="f.count" class="filter-count">{{ f.count }}</span>
      </button>
    </div>

    <!-- Header -->
    <div class="list-header">
      <span class="section-title">XOMASHYOLAR</span>
      <span class="section-count">{{ filtered.length }}</span>
    </div>

    <!-- List -->
    <TransitionGroup name="mat-list" tag="div" class="mat-list">
      <MaterialCard
        v-for="m in filtered"
        :key="m.id"
        :material="m"
      />
    </TransitionGroup>

    <div v-if="!filtered.length" class="empty">
      <span>🔬</span> Xomashyo topilmadi
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboard.js'
import MaterialCard from '@/components/MaterialCard.vue'

const store = useDashboardStore()
const query = ref('')
const activeFilter = ref('all')

function status(m) {
  if (m.current_stock <= 0)             return 'empty'
  if (m.current_stock < m.min_stock)    return 'low'
  if (m.current_stock < m.min_stock * 1.5) return 'warn'
  return 'ok'
}

const filters = computed(() => [
  { id: 'all',   label: 'Barchasi', count: store.materials.length },
  { id: 'low',   label: '⚠ Kam',   count: store.materials.filter(m => status(m) !== 'ok').length },
  { id: 'ok',    label: '✓ Yetarli', count: store.materials.filter(m => status(m) === 'ok').length },
])

const filtered = computed(() => {
  let list = store.materials
  if (query.value.trim()) {
    const q = query.value.trim().toLowerCase()
    list = list.filter(m => m.name.toLowerCase().includes(q))
  }
  if (activeFilter.value === 'low') list = list.filter(m => status(m) !== 'ok')
  if (activeFilter.value === 'ok')  list = list.filter(m => status(m) === 'ok')
  return list
})
</script>

<style scoped>
.materials-view { display: flex; flex-direction: column; gap: 10px; }

/* Search */
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface);
  border: 1px solid var(--border2);
  border-radius: var(--r-sm);
  padding: 10px 14px;
  transition: border-color 0.2s;
}
.search-box:focus-within { border-color: var(--neon2); box-shadow: 0 0 12px rgba(0,229,201,0.1); }
.search-ic    { font-size: 14px; opacity: 0.5; }
.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--txt);
  font-size: 14px;
  font-family: var(--f-body);
}
.search-input::placeholder { color: var(--txt3); }
.search-clear { color: var(--txt3); cursor: pointer; font-size: 12px; padding: 2px; }

/* Filters */
.filter-row { display: flex; gap: 6px; }
.filter-btn {
  display: flex; align-items: center; gap: 4px;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid var(--border2);
  background: var(--surface);
  color: var(--txt2);
  font-size: 11px;
  font-family: var(--f-body);
  cursor: pointer;
  transition: all 0.18s;
}
.filter-btn.active {
  background: rgba(0,229,201,0.1);
  border-color: var(--neon2);
  color: var(--neon2);
}
.filter-count {
  background: var(--surface3);
  border-radius: 8px;
  padding: 0 5px;
  font-size: 10px;
}

/* Header */
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

.mat-list { display: flex; flex-direction: column; gap: 7px; }

.mat-list-enter-active { transition: all 0.28s ease; }
.mat-list-leave-active { transition: all 0.2s ease; }
.mat-list-enter-from   { opacity: 0; transform: translateX(16px); }
.mat-list-leave-to     { opacity: 0; transform: translateX(-16px); }

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
