/**
 * useApi.js — Barcha backend API chaqiruvlari shu yerda.
 *
 * Dev rejimida vite.config.js proxy ishlatadi: /api → localhost:8000
 * Production da VITE_API_BASE env o'zgaruvchisi orqali URL beriladi.
 */

const BASE = import.meta.env.VITE_API_BASE
  ? import.meta.env.VITE_API_BASE
  : '' // dev: proxy orqali /api ishlaydi

async function get(path, params = {}) {
  const url    = new URL(BASE + path, window.location.origin)
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, v)
  })
  const res = await fetch(url)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export function useApi(chatId) {
  return {
    health:       ()            => get('/api/health'),
    checkAdmin:   (id)          => get(`/api/check-admin/${id}`),
    getStats:     ()            => get('/api/stats',     { chat_id: chatId }),
    getMaterials: ()            => get('/api/materials', { chat_id: chatId }),
    getProducts:  ()            => get('/api/products',  { chat_id: chatId }),
    getBatches:   (limit = 30)  => get('/api/batches',   { chat_id: chatId, limit }),
  }
}

/** SSE stream URL */
export function getSseUrl(chatId) {
  if (import.meta.env.VITE_API_BASE) {
    return `${import.meta.env.VITE_API_BASE}/api/stream/${chatId}`
  }
  return `/api/stream/${chatId}`
}
