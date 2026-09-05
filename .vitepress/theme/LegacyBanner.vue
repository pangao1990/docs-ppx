<script setup>
import { withBase } from 'vitepress'
</script>

<template>
  <aside class="ppx-legacy-banner" aria-label="PPX V5 归档提示">
    <strong>你正在阅读 PPX V5 归档文档</strong>
    <span>V5 继续保留供旧项目查阅，但不兼容 V6，也不会获得 V6 的新功能。</span>
    <a :href="withBase('/v6/guide/introduction')">开始使用 PPX V6 →</a>
  </aside>
</template>
