<!--
  用法（在 markdown 里）:
  <Incident type="事故" title="Azure 配置事故">

  **背景：** 想测试新模型 API...

  </Incident>

  <Incident type="解决方案" variant="success" title="三层防护架构">

  **Layer 3：** 跨实例心跳...

  </Incident>
-->
<script setup>
defineProps({
  type: { type: String, default: '事故' },
  title: { type: String, default: '' },
  variant: { type: String, default: '' } // 'success' for green label
})
</script>

<template>
  <div class="incident" :class="variant" :data-type="type">
    <h4 v-if="title">{{ title }}</h4>
    <slot />
  </div>
</template>

<style scoped>
.incident {
  background: var(--paper-warm, #f2ede4);
  border: 1px solid var(--border, #ddd);
  padding: 24px 24px;
  margin: 24px 0;
  position: relative;
}
.incident::before {
  content: attr(data-type);
  position: absolute;
  top: -10px;
  left: 20px;
  background: var(--accent, #8b4513);
  color: white;
  padding: 2px 12px;
  font-family: var(--f-ui, 'DM Sans', sans-serif);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.incident.success::before {
  background: #5a7a50;
}
.incident h4 {
  font-family: var(--f-head, 'Playfair Display', serif);
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}
</style>
