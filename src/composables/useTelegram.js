/**
 * useTelegram.js — Telegram WebApp SDK wrapper.
 * Dev rejimida URL ?chat_id=... parametri ishlatiladi.
 */

export function useTelegram() {
  const tg   = window.Telegram?.WebApp
  const user = tg?.initDataUnsafe?.user

  function init() {
    if (tg) {
      tg.ready()
      tg.expand()
    }
  }

  function getChatId() {
    // 1. Telegram WebApp dan
    if (user?.id) return user.id
    // 2. Dev: URL param dan
    const p = new URLSearchParams(window.location.search)
    const v = p.get('chat_id')
    return v ? parseInt(v) : null
  }

  function getUserName() {
    if (user?.first_name) return user.first_name
    return 'Admin'
  }

  function haptic(type = 'light') {
    tg?.HapticFeedback?.impactOccurred(type)
  }

  return { init, getChatId, getUserName, haptic }
}
