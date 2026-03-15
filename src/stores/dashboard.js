/**
 * stores/dashboard.js — Pinia store.
 * Barcha app state shu yerda boshqariladi.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi, getSseUrl } from '@/composables/useApi.js'

export const useDashboardStore = defineStore('dashboard', () => {
  /* ── Auth ─────────────────────────────────────────────── */
  const chatId   = ref(null)
  const userName = ref('Admin')
  const isAdmin  = ref(false)

  /* ── App state ────────────────────────────────────────── */
  const appState   = ref('loading')  // loading | denied | ready
  const lastUpdate = ref(null)
  const toastMsg   = ref('')
  const toastShow  = ref(false)

  /* ── Data ─────────────────────────────────────────────── */
  const stats     = ref({
    materials_count: 0, products_count: 0,
    batches_count: 0,   low_stock_count: 0,
    total_produced: 0,  weekly_production: [],
    top_products: [],
  })
  const materials = ref([])
  const products  = ref([])
  const batches   = ref([])

  /* ── SSE ──────────────────────────────────────────────── */
  let sseSource    = null
  let toastTimer   = null
  let reconnectTmr = null

  /* ── Computed ─────────────────────────────────────────── */
  const lowStockMaterials = computed(() =>
    materials.value.filter(m => m.current_stock < m.min_stock)
  )

  const recentBatches = computed(() => batches.value.slice(0, 5))

  const weeklyChart = computed(() => {
    const now  = new Date()
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d   = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      const found = stats.value.weekly_production?.find(w => w.day === key)
      days.push({
        label: ['Yak','Du','Se','Cho','Pay','Jum','Sha'][d.getDay()],
        val:   found ? found.total : 0,
        isToday: i === 0,
      })
    }
    const max = Math.max(...days.map(d => d.val), 1)
    return days.map(d => ({ ...d, pct: Math.max(Math.round((d.val / max) * 80), 3) }))
  })

  /* ── Actions ──────────────────────────────────────────── */

  function showToast(msg = 'Yangilandi') {
    toastMsg.value  = msg
    toastShow.value = true
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => { toastShow.value = false }, 2800)
  }

  async function init(cid, uname) {
    chatId.value   = 8249732505
    userName.value = uname

    const api = useApi(cid)

    // Admin tekshiruvi
    try {
      const { is_admin } = await api.checkAdmin(cid)
      if (!is_admin) { appState.value = 'denied'; return }
      isAdmin.value = true
    } catch {
      appState.value = 'denied'
      return
    }

    // Barcha ma'lumotlarni yuklash
    await loadAll()
    appState.value = 'ready'

    // SSE ulanish
    connectSSE()
  }

  async function loadAll() {
    const api = useApi(chatId.value)
    const [s, m, p, b] = await Promise.all([
      api.getStats(),
      api.getMaterials(),
      api.getProducts(),
      api.getBatches(30),
    ])
    stats.value     = s
    materials.value = m
    products.value  = p
    batches.value   = b
    lastUpdate.value = new Date()
  }

  function connectSSE() {
    if (!chatId.value) return
    if (sseSource) { sseSource.close(); sseSource = null }

    sseSource = new EventSource(getSseUrl(chatId.value))

    sseSource.onmessage = async (e) => {
      try {
        const payload = JSON.parse(e.data)
        if (payload.error) return

        const prevBatchCount = stats.value.batches_count

        // Materials real-time
        if (payload.materials) {
          materials.value = payload.materials
        }

        // Stats patch
        if (payload.stats) {
          stats.value = { ...stats.value, ...payload.stats }
        }

        // Yangi partiya bo'lsa — products + batches ham yangilash
        if (payload.stats?.batches_count > prevBatchCount) {
          const api = useApi(chatId.value)
          const [p, b, s] = await Promise.all([
            api.getProducts(),
            api.getBatches(30),
            api.getStats(),
          ])
          products.value = p
          batches.value  = b
          stats.value    = s
          showToast('🟢 Yangi partiya qo\'shildi!')
        }

        lastUpdate.value = new Date()
      } catch (err) {
        console.error('[SSE parse]', err)
      }
    }

    sseSource.onerror = () => {
      sseSource?.close()
      sseSource = null
      clearTimeout(reconnectTmr)
      reconnectTmr = setTimeout(connectSSE, 5000)
    }
  }

  function destroy() {
    sseSource?.close()
    clearTimeout(toastTimer)
    clearTimeout(reconnectTmr)
  }

  return {
    chatId, userName, isAdmin,
    appState, lastUpdate, toastMsg, toastShow,
    stats, materials, products, batches,
    lowStockMaterials, recentBatches, weeklyChart,
    init, loadAll, destroy, showToast,
  }
})
