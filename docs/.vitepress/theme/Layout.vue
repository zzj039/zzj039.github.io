<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import CommentBox from './components/CommentBox.vue'
import SidebarToggle from './components/SidebarToggle.vue'
import AsideToggle from './components/AsideToggle.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <SidebarToggle />
      <AsideToggle />
    </template>
    <template #sidebar-nav-after>
      <CommentBox />
    </template>
  </Layout>
</template>
