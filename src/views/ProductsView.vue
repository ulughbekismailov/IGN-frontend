<template>
  <div class="products-view">

    <div class="list-header">
      <span class="section-title">DORILAR VA RETSEPTLAR</span>
      <span class="section-count">{{ store.products.length }}</span>
    </div>

    <div class="product-list" v-if="store.products.length">
      <ProductCard
        v-for="(p, i) in store.products"
        :key="p.id"
        :product="p"
        :style="{ animationDelay: i * 0.05 + 's' }"
      />
    </div>

    <div v-else class="empty">
      <span>💊</span> Dorilar topilmadi
    </div>

  </div>
</template>

<script setup>
import { useDashboardStore } from '@/stores/dashboard.js'
import ProductCard from '@/components/ProductCard.vue'

const store = useDashboardStore()
</script>

<style scoped>
.products-view { display: flex; flex-direction: column; gap: 10px; }

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

.product-list { display: flex; flex-direction: column; gap: 10px; }

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
