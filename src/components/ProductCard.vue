<template>
  <div class="product-card" @click="open = !open">

    <!-- Header -->
    <div class="pc-header">
      <div class="pc-pill">💊</div>
      <div class="pc-info">
        <div class="pc-name truncate">{{ product.name }}</div>
        <div class="pc-meta">
          <span class="badge violet">{{ product.recipe.length }} ingredient</span>
          <span class="badge" :class="canProduce ? 'green' : 'red'">
            {{ canProduce ? '✓ Mumkin' : '✗ Yetishmaydi' }}
          </span>
        </div>
      </div>
      <div class="pc-total">
        <div class="pc-total-val" :key="product.total_produced">
          {{ product.total_produced }}
        </div>
        <div class="pc-total-label">DONA</div>
      </div>
    </div>

    <!-- Expandable recipe -->
    <Transition name="expand">
      <div v-if="open" class="pc-body">
        <div class="recipe-title">TARKIBI — 1 DONA UCHUN</div>
        <div class="recipe-list">
          <div
            v-for="r in product.recipe"
            :key="r.material_id"
            class="recipe-row"
          >
            <div class="recipe-left">
              <div class="recipe-name">{{ r.material_name }}</div>
              <div class="recipe-stock">
                Ombor:
                <span :class="stockColor(r)">
                  {{ (r.current_stock ?? 0).toFixed(2) }} {{ r.unit }}
                </span>
              </div>
            </div>
            <div class="recipe-qty">{{ r.quantity_grams }}<span class="recipe-unit">g</span></div>
          </div>
        </div>

        <div class="pc-footer">
          <span class="last-batch">
            {{ product.last_batch
                ? '⏱ ' + formatTime(product.last_batch.produced_at)
                : 'Hali ishlab chiqarilmagan' }}
          </span>
          <span class="can-badge" :class="canProduce ? 'green' : 'red'">
            {{ canProduce ? '✓ Ishlab chiqarish mumkin' : '✗ Material yetishmaydi' }}
          </span>
        </div>
      </div>
    </Transition>

    <!-- Expand indicator -->
    <div class="pc-toggle">{{ open ? '▲' : '▼' }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ product: Object })
const open  = ref(false)

const canProduce = computed(() => {
  if (!props.product.recipe?.length) return false
  return props.product.recipe.every(r => {
    const needed = r.quantity_grams / 1000
    return (r.current_stock ?? 0) >= needed
  })
})

function stockColor(r) {
  const needed = r.quantity_grams / 1000
  if ((r.current_stock ?? 0) < needed)      return 'c-red'
  if ((r.current_stock ?? 0) < needed * 2)  return 'c-amber'
  return 'c-green'
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
.product-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r);
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s;
  animation: fadeUp 0.3s ease both;
}
.product-card:active { transform: scale(0.99); }
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Header */
.pc-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
}
.pc-pill {
  width: 46px; height: 46px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(124,109,255,0.2), rgba(0,229,201,0.1));
  border: 1px solid rgba(124,109,255,0.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}
.pc-info { flex: 1; min-width: 0; }
.pc-name { font-size: 15px; font-weight: 600; margin-bottom: 5px; }
.pc-meta { display: flex; gap: 5px; flex-wrap: wrap; }

.badge {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 12px;
  font-family: var(--f-display);
  letter-spacing: 0.5px;
}
.badge.violet { background: rgba(124,109,255,0.12); border: 1px solid rgba(124,109,255,0.25); color: var(--neon5); }
.badge.green  { background: rgba(57,255,133,0.1);  border: 1px solid rgba(57,255,133,0.22);  color: var(--neon); }
.badge.red    { background: rgba(255,59,107,0.1);  border: 1px solid rgba(255,59,107,0.22);  color: var(--neon3); }

.pc-total { text-align: right; flex-shrink: 0; }
.pc-total-val {
  font-family: var(--f-display);
  font-size: 28px;
  color: var(--neon5);
  line-height: 1;
  animation: numPop 0.3s ease;
}
@keyframes numPop {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.1); }
  100% { transform: scale(1); }
}
.pc-total-label { font-size: 9px; letter-spacing: 2px; color: var(--txt3); font-family: var(--f-display); }

/* Toggle */
.pc-toggle {
  text-align: center;
  font-size: 9px;
  color: var(--txt3);
  padding: 2px 0 6px;
  letter-spacing: 1px;
}

/* Body */
.pc-body {
  border-top: 1px solid var(--border);
  padding: 12px 14px;
  background: var(--surface2);
}
.expand-enter-active { transition: all 0.22s ease; }
.expand-leave-active { transition: all 0.18s ease; }
.expand-enter-from,
.expand-leave-to { opacity: 0; transform: translateY(-6px); }

.recipe-title {
  font-family: var(--f-display);
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--txt3);
  margin-bottom: 8px;
}
.recipe-list { display: flex; flex-direction: column; gap: 1px; }
.recipe-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 0;
  border-bottom: 1px solid var(--border);
}
.recipe-row:last-child { border-bottom: none; }
.recipe-name { font-size: 13px; font-weight: 500; }
.recipe-stock { font-size: 10px; color: var(--txt3); margin-top: 2px; }
.c-green { color: var(--neon);  }
.c-amber { color: var(--neon4); }
.c-red   { color: var(--neon3); }

.recipe-qty {
  font-family: var(--f-display);
  font-size: 18px;
  color: var(--neon2);
}
.recipe-unit { font-size: 10px; color: var(--txt3); }

.pc-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--border);
}
.last-batch { font-size: 11px; color: var(--txt3); }
.can-badge {
  font-size: 10px;
  padding: 3px 10px;
  border-radius: 12px;
  font-weight: 600;
  font-family: var(--f-display);
  letter-spacing: 0.5px;
}
.can-badge.green { background: rgba(57,255,133,0.1);  border: 1px solid rgba(57,255,133,0.22); color: var(--neon);  }
.can-badge.red   { background: rgba(255,59,107,0.1);  border: 1px solid rgba(255,59,107,0.22); color: var(--neon3); }
</style>
