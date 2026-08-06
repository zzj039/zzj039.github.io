<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

// giscus 配置（来自 https://giscus.app 生成的代码）
const GISCUS_CONFIG = {
  repo: 'zzj039/zzj039.github.io',
  repoId: 'R_kgDOTuP-Gw',
  category: 'Announcements',
  categoryId: 'DIC_kwDOTuP-G84DCxId',
  mapping: 'pathname',
  strict: '0',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'bottom',
  theme: 'preferred_color_scheme',
  lang: 'zh-CN',
}

const route = useRoute()
const COLLAPSE_KEY = 'comment-collapsed'

/** 是否展开留言区（默认展开，收起状态存 localStorage） */
const expanded = ref(true)
let scriptEl: HTMLScriptElement | null = null
/** 当前已加载留言的页面路径，避免重复加载/漏加载 */
let loadedRoute = ''

onMounted(() => {
  try {
    expanded.value = localStorage.getItem(COLLAPSE_KEY) !== '1'
  } catch {
    /* ignore */
  }
  if (expanded.value) loadGiscus()
  watch(
    () => route.path,
    () => {
      // VitePress 是 SPA，切页后按新路径重新加载评论区
      if (expanded.value) loadGiscus()
    },
  )
})

onBeforeUnmount(() => {
  if (scriptEl) scriptEl.remove()
})

function toggle() {
  expanded.value = !expanded.value
  try {
    localStorage.setItem(COLLAPSE_KEY, expanded.value ? '0' : '1')
  } catch {
    /* ignore */
  }
  // 展开时若当前页面还没加载过留言，则加载
  if (expanded.value && loadedRoute !== route.path) loadGiscus()
}

function loadGiscus() {
  const container = document.getElementById('giscus-container')
  if (!container) return

  // 重建留言容器，清掉上一次的 giscus 渲染结果
  container.innerHTML = ''
  const box = document.createElement('div')
  box.className = 'giscus'
  container.appendChild(box)

  // 移除旧的 giscus 脚本，重新注入以触发对新容器的处理
  const oldScript = document.querySelector(
    'script[src="https://giscus.app/client.js"]',
  )
  if (oldScript) oldScript.remove()

  scriptEl = document.createElement('script')
  scriptEl.src = 'https://giscus.app/client.js'
  scriptEl.async = true
  scriptEl.crossOrigin = 'anonymous'
  scriptEl.dataset.repo = GISCUS_CONFIG.repo
  scriptEl.dataset.repoId = GISCUS_CONFIG.repoId
  scriptEl.dataset.category = GISCUS_CONFIG.category
  scriptEl.dataset.categoryId = GISCUS_CONFIG.categoryId
  scriptEl.dataset.mapping = GISCUS_CONFIG.mapping
  scriptEl.dataset.strict = GISCUS_CONFIG.strict
  scriptEl.dataset.reactionsEnabled = GISCUS_CONFIG.reactionsEnabled
  scriptEl.dataset.emitMetadata = GISCUS_CONFIG.emitMetadata
  scriptEl.dataset.inputPosition = GISCUS_CONFIG.inputPosition
  scriptEl.dataset.theme = GISCUS_CONFIG.theme
  scriptEl.dataset.lang = GISCUS_CONFIG.lang
  document.body.appendChild(scriptEl)
  loadedRoute = route.path
}
</script>

<template>
  <div class="comment-box">
    <button
      class="comment-box-header"
      type="button"
      :aria-expanded="expanded"
      @click="toggle"
    >
      <span class="comment-box-title">💬 留言 / 评论</span>
      <span class="comment-box-caret">{{ expanded ? '▾' : '▸' }}</span>
    </button>
    <div v-show="expanded" id="giscus-container"></div>
  </div>
</template>

<style scoped>
.comment-box {
  margin-top: 24px;
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
}

.comment-box-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 4px 0;
  border: none;
  background: none;
  color: var(--vp-c-text-1);
  cursor: pointer;
  text-align: left;
}

.comment-box-header:hover .comment-box-title {
  color: var(--vp-c-brand-1);
}

.comment-box-title {
  font-size: 14px;
  font-weight: 600;
  transition: color 0.25s;
}

.comment-box-caret {
  font-size: 12px;
  color: var(--vp-c-text-3);
  transition: color 0.25s;
}

.comment-box-header:hover .comment-box-caret {
  color: var(--vp-c-text-2);
}
</style>
