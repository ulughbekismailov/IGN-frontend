<template>
  <div class="loading">
    <div class="logo">
      <span class="logo-icon">⚗</span>
      <div class="logo-ring" />
    </div>
    <h1 class="title">PHARMACITY</h1>
    <p class="sub">Tizim yuklanmoqda</p>
    <div class="bar"><div class="bar-fill" /></div>
  </div>
</template>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100dvh;
  gap: 14px;
  position: relative;
  z-index: 10;
}

.logo {
  position: relative;
  width: 80px; height: 80px;
  display: flex; align-items: center; justify-content: center;
}
.logo-icon {
  font-size: 36px;
  z-index: 1;
  animation: iconPulse 2s ease-in-out infinite;
}
.logo-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: var(--neon);
  border-right-color: var(--neon2);
  animation: spin 1.4s linear infinite;
  box-shadow: 0 0 20px rgba(57,255,133,0.3);
}
@keyframes spin     { to { transform: rotate(360deg); } }
@keyframes iconPulse {
  0%,100% { transform: scale(1); filter: drop-shadow(0 0 0 transparent); }
  50%     { transform: scale(1.08); filter: drop-shadow(0 0 12px var(--neon)); }
}

.title {
  font-family: var(--f-display);
  font-size: 32px;
  letter-spacing: 6px;
  background: linear-gradient(90deg, var(--neon), var(--neon2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.sub { color: var(--txt3); font-size: 12px; letter-spacing: 1px; }

.bar {
  width: 140px; height: 2px;
  background: var(--surface3);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 4px;
}
.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--neon), var(--neon2));
  animation: loadBar 1.6s ease-in-out infinite;
}
@keyframes loadBar {
  0%   { width: 0%;   margin-left: 0%; }
  50%  { width: 75%;  margin-left: 12%; }
  100% { width: 0%;   margin-left: 100%; }
}
</style>
