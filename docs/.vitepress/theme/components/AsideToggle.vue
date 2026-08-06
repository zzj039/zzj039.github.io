<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

/**
 * 右侧目录（outline）折叠手柄，与左侧边栏手柄对称。
 * 点击后在 <html> 上切换 .no-aside 类，隐藏右侧目录并让正文变宽；
 * 状态存 localStorage。只在存在右侧目录的页面显示。
 */
const route = useRoute()

const hidden = ref(false)
const show = ref(false)

onMounted(async () => {
  hidden.value = document.documentElement.classList.contains('no-aside')
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
    !!document.querySelector('.VPDocAside') ||
    !!document.querySelector('.VPDoc.has-aside')
}

function toggle() {
  hidden.value = !hidden.value
  document.documentElement.classList.toggle('no-aside', hidden.value)
  try {
    localStorage.setItem('no-aside', hidden.value ? '1' : '0')
  } catch {
    /* ignore */
  }
}
</script>

<template>
  <button
    v-show="show"
    class="aside-toggle"
    type="button"
    :title="hidden ? '显示右侧目录' : '收起右侧目录（放大内容区）'"
    :aria-label="hidden ? '显示右侧目录' : '收起右侧目录'"
    @click="toggle"
  >
    <span class="aside-toggle-icon">{{ hidden ? '◀' : '▶' }}</span>
  </button>
</template>

<style scoped>
.aside-toggle {
  position: fixed;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 48px;
  padding: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px 0 0 6px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color 0.25s, background-color 0.25s, border-color 0.25s;
}

.aside-toggle:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.aside-toggle-icon {
  font-size: 9px;
  line-height: 1;
}

/* 右侧目录只在 ≥1280px 显示，按钮同样只在此时出现 */
@media (max-width: 1279px) {
  .aside-toggle {
    display: none;
  }
}
</style>
