<template>
  <div class="denied">
    <div class="icon">🔒</div>
    <h2 class="title">RUXSAT YO'Q</h2>
    <p class="text">
      Bu panel faqat administratorlar uchun.<br />
      Telegram botda adminlik huquqi so'rang.
    </p>
  </div>
</template>

<style scoped>
.denied {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100dvh;
  gap: 14px;
  padding: 32px;
  text-align: center;
  position: relative;
  z-index: 10;
}
.icon  { font-size: 52px; filter: grayscale(0.3); }
.title {
  font-family: var(--f-display);
  font-size: 28px;
  letter-spacing: 4px;
  color: var(--neon3);
  text-shadow: 0 0 20px rgba(255,59,107,0.5);
}
.text  { color: var(--txt2); font-size: 14px; line-height: 1.7; }
</style>
