<template>
  <div class="stat-card" :class="color">
    <span class="stat-icon">{{ icon }}</span>
    <div class="stat-val" :key="value">{{ value }}</div>
    <div class="stat-label">{{ label }}</div>
    <div class="stat-line" />
  </div>
</template>

<script setup>
defineProps({
  icon:  String,
  value: [Number, String],
  label: String,
  color: String,
})
</script>

<style scoped>
.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r);
  padding: 14px;
  position: relative;
  overflow: hidden;
  transition: transform 0.15s;
}
.stat-card:active { transform: scale(0.97); }

.stat-icon { font-size: 20px; display: block; margin-bottom: 8px; }

.stat-val {
  font-family: var(--f-display);
  font-size: 36px;
  line-height: 1;
  animation: numPop 0.35s ease;
}
@keyframes numPop {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.12); }
  100% { transform: scale(1); }
}

.stat-label {
  font-size: 10px;
  color: var(--txt3);
  margin-top: 4px;
  font-family: var(--f-display);
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.stat-line {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
}

/* Color variants */
.cyan   .stat-val  { color: var(--neon2); }
.cyan   .stat-line { background: linear-gradient(90deg, var(--neon2), transparent); box-shadow: 0 0 10px rgba(0,229,201,0.4); }
.green  .stat-val  { color: var(--neon); }
.green  .stat-line { background: linear-gradient(90deg, var(--neon), transparent); box-shadow: 0 0 10px rgba(57,255,133,0.4); }
.violet .stat-val  { color: var(--neon5); }
.violet .stat-line { background: linear-gradient(90deg, var(--neon5), transparent); box-shadow: 0 0 10px rgba(124,109,255,0.4); }
.pink   .stat-val  { color: var(--neon3); }
.pink   .stat-line { background: linear-gradient(90deg, var(--neon3), transparent); box-shadow: 0 0 10px rgba(255,59,107,0.4); }
</style>
