<!--
  用法（在 markdown 里）:
  <TwoCol>
  <template #left>

  ### 左边标题
  - 内容1
  - 内容2

  </template>
  <template #right>

  ### 右边标题
  - 内容A
  - 内容B

  </template>
  </TwoCol>
-->
<template>
  <div class="two-col">
    <div class="two-col-left"><slot name="left" /></div>
    <div class="two-col-right"><slot name="right" /></div>
  </div>
</template>

<style scoped>
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  margin: 24px 0;
}
@media (max-width: 640px) {
  .two-col { grid-template-columns: 1fr; }
}
</style>
