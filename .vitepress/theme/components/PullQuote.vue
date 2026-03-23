<!--
  用法（在 markdown 里）:
  <PullQuote cite="— Azure 配置事故教训 #1">

  用户说"只添加"
  就不要"顺便优化"

  </PullQuote>
-->
<script setup>
defineProps({
  cite: { type: String, default: '' }
})
</script>

<template>
  <div class="pull-quote">
    <p><slot /></p>
    <cite v-if="cite">{{ cite }}</cite>
  </div>
</template>

<style scoped>
.pull-quote {
  margin: 40px 0;
  padding: 28px 0;
  border-top: 1px solid var(--border, #ddd);
  border-bottom: 1px solid var(--border, #ddd);
  text-align: center;
}
.pull-quote p {
  font-family: var(--f-head, 'Playfair Display', serif);
  font-size: 24px;
  font-weight: 700;
  line-height: 1.5;
  color: var(--ink, #222);
  max-width: 520px;
  margin: 0 auto;
}
.pull-quote cite {
  display: block;
  margin-top: 12px;
  font-family: var(--f-ui, 'DM Sans', sans-serif);
  font-size: 12px;
  color: var(--ink-muted, #999);
  font-style: normal;
  letter-spacing: 1px;
}
</style>
