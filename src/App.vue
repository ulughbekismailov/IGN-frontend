<template>
  <div class="app-root">
    <!-- Animated background -->
    <div class="bg-layer" aria-hidden="true">
      <div class="bg-orb orb-1" />
      <div class="bg-orb orb-2" />
      <div class="bg-orb orb-3" />
    </div>

    <!-- Loading -->
    <LoadingScreen v-if="store.appState === 'loading'" />

    <!-- Access Denied -->
    <AccessDenied v-else-if="store.appState === 'denied'" />

    <!-- Main App -->
    <template v-else>
      <AppHeader />
      <UpdateToast />

      <main class="scroll-area" ref="scrollEl">
        <Transition :name="tabTransition" mode="out-in">
          <OverviewView   v-if="activeTab === 'overview'"   key="overview" />
          <MaterialsView  v-else-if="activeTab === 'materials'" key="materials" />
          <ProductsView   v-else-if="activeTab === 'products'"  key="products" />
          <BatchesView    v-else-if="activeTab === 'batches'"    key="batches" />
        </Transition>
      </main>

      <BottomNav :active="activeTab" @change="onTabChange" />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard.js'
import { useTelegram } from '@/composables/useTelegram.js'

import LoadingScreen from '@/components/LoadingScreen.vue'
import AccessDenied  from '@/components/AccessDenied.vue'
import AppHeader     from '@/components/AppHeader.vue'
import UpdateToast   from '@/components/UpdateToast.vue'
import BottomNav     from '@/components/BottomNav.vue'
import OverviewView  from '@/views/OverviewView.vue'
import MaterialsView from '@/views/MaterialsView.vue'
import ProductsView  from '@/views/ProductsView.vue'
import BatchesView   from '@/views/BatchesView.vue'

const store = useDashboardStore()
const { init, getChatId, getUserName, haptic } = useTelegram()

const activeTab    = ref('overview')
const tabTransition= ref('slide-left')
const scrollEl     = ref(null)

const TAB_ORDER    = ['overview', 'materials', 'products', 'batches']

function onTabChange(tab) {
  const from = TAB_ORDER.indexOf(activeTab.value)
  const to   = TAB_ORDER.indexOf(tab)
  tabTransition.value = to > from ? 'slide-left' : 'slide-right'
  activeTab.value = tab
  haptic('light')
  scrollEl.value?.scrollTo({ top: 0, behavior: 'instant' })
}

onMounted(async () => {
  init()
  const chatId = getChatId()
  const uname = getUserName()
  console.log(chatId);
  
  if (!chatId) { 
    store.appState = 'denied'
    return 
  }
  try {
    await store.init(chatId, uname)
  } catch (error) {
    console.error('Init xatolik:', error)
    store.appState = 'denied'
  }
})
onUnmounted(() => store.destroy())
</script>

<style scoped>
.app-root {
  position: relative;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  max-width: 480px;
  margin: 0 auto;
  overflow: hidden;
}

/* ── Background orbs ── */
.bg-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  max-width: 480px;
  margin: 0 auto;
}
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.45;
}
.orb-1 {
  width: 360px; height: 360px;
  background: radial-gradient(circle, rgba(57,255,133,0.12), transparent 65%);
  top: -120px; left: -80px;
  animation: orbFloat 20s ease-in-out infinite;
}
.orb-2 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(0,229,201,0.09), transparent 65%);
  bottom: 60px; right: -60px;
  animation: orbFloat 26s ease-in-out infinite reverse;
}
.orb-3 {
  width: 220px; height: 220px;
  background: radial-gradient(circle, rgba(255,59,107,0.07), transparent 65%);
  top: 45%; left: 40%;
  animation: orbFloat 17s ease-in-out infinite 5s;
}
@keyframes orbFloat {
  0%,100% { transform: translate(0, 0) scale(1); }
  33%     { transform: translate(40px, 30px) scale(1.08); }
  66%     { transform: translate(-25px, 55px) scale(0.94); }
}

/* ── Scroll area ── */
.scroll-area {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  z-index: 1;
  padding: 14px 14px calc(var(--nav-h) + 14px);
  scroll-behavior: smooth;
}
.scroll-area::-webkit-scrollbar { display: none; }

/* ── Tab transitions ── */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-left-enter-from  { opacity: 0; transform: translateX(28px); }
.slide-left-leave-to    { opacity: 0; transform: translateX(-28px); }
.slide-right-enter-from { opacity: 0; transform: translateX(-28px); }
.slide-right-leave-to   { opacity: 0; transform: translateX(28px); }
</style>
