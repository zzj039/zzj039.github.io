<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

/**
 * 侧边栏收起/展开浮动手柄（位于左侧边栏边界处）。
 * 点击后在 <html> 上切换 .no-sidebar 类，配合 style.css
 * 隐藏左侧栏并让中间内容区自动变宽；状态存 localStorage。
 * 只在有侧边栏的页面显示。
 */
const route = useRoute()

const hidden = ref(false)
const show = ref(false)

onMounted(async () => {
  hidden.value = document.documentElement.classList.contains('no-sidebar')
  await nextTick()
  updateShow()
  watch(
    () => route.path,
    async () => {
      await nextTick()
      updateShow()
    },
  )
})

function updateShow() {
  show.value =
    !!document.querySelector('.VPSidebar') ||
    !!document.querySelector('.VPContent.has-sidebar')
}

function toggle() {
  hidden.value = !hidden.value
  document.documentElement.classList.toggle('no-sidebar', hidden.value)
  try {
    localStorage.setItem('no-sidebar', hidden.value ? '1' : '0')
  } catch {
    /* 隐私模式下写入失败可忽略 */
  }
}
</script>

<template>
  <button
    v-show="show"
    class="sidebar-toggle"
    type="button"
    :title="hidden ? '显示侧边栏' : '收起侧边栏（放大内容区）'"
    :aria-label="hidden ? '显示侧边栏' : '收起侧边栏'"
    @click="toggle"
  >
    <span class="sidebar-toggle-icon">{{ hidden ? '▶' : '◀' }}</span>
  </button>
</template>

<style scoped>
.sidebar-toggle {
  position: fixed;
  top: 50%;
  left: var(--vp-sidebar-width);
  transform: translate(-50%, -50%);
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 48px;
  padding: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0 6px 6px 0;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color 0.25s, background-color 0.25s, border-color 0.25s;
}

.sidebar-toggle:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.sidebar-toggle-icon {
  font-size: 9px;
  line-height: 1;
}

/* 侧边栏已收起时，手柄贴到页面左缘 */
html.no-sidebar .sidebar-toggle {
  left: 10px;
  border-radius: 6px;
}

@media (max-width: 959px) {
  /* 移动端侧边栏本就是抽屉，无需此按钮 */
  .sidebar-toggle {
    display: none;
  }
}
</style>
