<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * 学习页图片轮播：展示 images 目录下除 logo 之外的所有图片，
 * 每张停留 3 秒，淡入淡出切换。
 * （新增图片后，把文件名追加到下面的列表即可）
 */
const images = [
  '/images/顺德园景湖日出.jpg',
  '/images/顺德校区大观.jpg',
  '/images/顺德校区正门.jpg',
  '/images/顺德校区景湖西观.jpg',
  '/images/顺德校区图书馆.jpg',
  '/images/校本部正门.jpg',
  '/images/龙舟.jpg',
  '/images/life.png',
  '/images/thoughts.jpg',
]

const index = ref(0)
let timer: number | null = null

onMounted(() => {
  timer = window.setInterval(() => {
    index.value = (index.value + 1) % images.length
  }, 3000)
})

onBeforeUnmount(() => {
  if (timer !== null) clearInterval(timer)
})

function goTo(i: number) {
  index.value = i
}
</script>

<template>
  <div class="image-carousel">
    <transition name="carousel-fade" mode="out-in">
      <img
        :key="index"
        class="carousel-img"
        :src="images[index]"
        :alt="'校园风景 ' + (index + 1)"
        loading="lazy"
      />
    </transition>
    <div class="carousel-dots">
      <button
        v-for="(img, i) in images"
        :key="img"
        type="button"
        class="carousel-dot"
        :class="{ active: i === index }"
        :aria-label="'第 ' + (i + 1) + ' 张'"
        @click="goTo(i)"
      />
    </div>
  </div>
</template>

<style scoped>
.image-carousel {
  position: relative;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
  animation: schoolFadeIn 1.2s ease-out both;
}

.carousel-img {
  display: block;
  width: 100%;
  height: auto;
}

.carousel-dots {
  position: absolute;
  left: 50%;
  bottom: 14px;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(2px);
}

.carousel-dot {
  width: 8px;
  height: 8px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background-color 0.25s, transform 0.25s;
}

.carousel-dot.active {
  background: #fff;
  transform: scale(1.25);
}

.carousel-fade-enter-active,
.carousel-fade-leave-active {
  transition: opacity 0.5s ease;
}

.carousel-fade-enter-from,
.carousel-fade-leave-to {
  opacity: 0;
}
</style>
