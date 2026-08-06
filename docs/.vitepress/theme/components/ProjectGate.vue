<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * 项目经历页的访问门槛：答对问题才能查看内容。
 * 答对后状态存 localStorage，再次访问无需重复验证。
 * 答错后进入 10 分钟冷却期，期间无法再次作答。
 */
const STORAGE_KEY = 'project-gate-unlocked'
const PENALTY_KEY = 'project-gate-penalty'
const PENALTY_MS = 10 * 60 * 1000 // 10 分钟
const CORRECT = 'B'

const options = [
  { key: 'A', label: 'A. MN导航者' },
  { key: 'B', label: 'B. 夏老师' },
  { key: 'C', label: 'C. 刀客塔' },
  { key: 'D', label: 'D. R6S 玩家' },
]

const unlocked = ref(false)
/** 剩余冷却毫秒数，>0 表示处于惩罚期 */
const penaltyLeft = ref(0)
let timer: number | null = null

const penaltyText = computed(() => {
  const totalSec = Math.ceil(penaltyLeft.value / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return m > 0 ? `${m} 分 ${s} 秒` : `${s} 秒`
})

onMounted(() => {
  try {
    unlocked.value = localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    /* ignore */
  }
  // 读取上次的惩罚剩余时间（页面刷新后仍然有效）
  try {
    const until = Number(localStorage.getItem(PENALTY_KEY) || 0)
    penaltyLeft.value = until > Date.now() ? until - Date.now() : 0
  } catch {
    /* ignore */
  }
  if (penaltyLeft.value > 0) startCountdown()
})

onBeforeUnmount(() => {
  if (timer !== null) clearInterval(timer)
})

function startCountdown() {
  if (timer !== null) clearInterval(timer)
  timer = window.setInterval(() => {
    penaltyLeft.value = Math.max(0, penaltyLeft.value - 1000)
    if (penaltyLeft.value <= 0) {
      if (timer !== null) {
        clearInterval(timer)
        timer = null
      }
      try {
        localStorage.removeItem(PENALTY_KEY)
      } catch {
        /* ignore */
      }
    }
  }, 1000)
}

function check(key: string) {
  if (penaltyLeft.value > 0) return // 惩罚期内不可作答
  if (key === CORRECT) {
    unlocked.value = true
    try {
      localStorage.setItem(STORAGE_KEY, '1')
      localStorage.removeItem(PENALTY_KEY)
    } catch {
      /* ignore */
    }
  } else {
    penaltyLeft.value = PENALTY_MS
    try {
      localStorage.setItem(PENALTY_KEY, String(Date.now() + PENALTY_MS))
    } catch {
      /* ignore */
    }
    startCountdown()
  }
}
</script>

<template>
  <div class="project-gate">
    <div v-if="unlocked" class="gate-revealed">
      <h2>✅ 验证通过</h2>
      <p>
        这里将展示「项目经历」内容。目前是占位文本，之后直接在
        <code>ProjectGate.vue</code> 的 <code>gate-revealed</code> 区块里替换成真实内容即可。
      </p>
      <ul>
        <li>项目一：待补充</li>
        <li>项目二：待补充</li>
        <li>项目三：待补充</li>
      </ul>
    </div>

    <div v-else class="gate-locked">
      <div class="gate-box">
        <p class="gate-tip">🔒 本页为「项目经历」，需要回答对下面的问题才能访问：</p>
        <p class="gate-question">谁是风火独狼？</p>
        <div class="gate-options">
          <button
            v-for="opt in options"
            :key="opt.key"
            type="button"
            class="gate-option"
            :disabled="penaltyLeft > 0"
            @click="check(opt.key)"
          >
            {{ opt.label }}
          </button>
        </div>
        <p v-if="penaltyLeft > 0" class="gate-wrong">
          ❌ 答错了，请等待 <strong>{{ penaltyText }}</strong> 后再试
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gate-box {
  max-width: 440px;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  text-align: center;
}

.gate-tip {
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.gate-question {
  margin: 12px 0 16px;
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.gate-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.gate-option {
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.25s, color 0.25s, opacity 0.25s;
}

.gate-option:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.gate-option:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.gate-wrong {
  margin: 14px 0 0;
  font-size: 14px;
  color: var(--vp-c-danger, #e0574f);
}
</style>
