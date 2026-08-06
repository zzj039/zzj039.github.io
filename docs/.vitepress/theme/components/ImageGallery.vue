<script setup lang="ts">
import { ref } from 'vue'

/**
 * 学习页图片画廊：
 * 上方大图默认展示顺德园景湖日出，其余图片以小图形式按行排在大图下方；
 * 点击任意小图，即在上方放大展示。纯点击切换，无自动轮播。
 * （新增图片后，把文件名追加到下面的列表即可）
 */
const images = [
  { src: '/images/顺德园景湖日出.jpg', name: '顺德园景湖日出' },
  { src: '/images/顺德校区大观.jpg', name: '顺德校区大观' },
  { src: '/images/顺德校区正门.jpg', name: '顺德校区正门' },
  { src: '/images/顺德校区景湖西观.jpg', name: '顺德校区景湖西观' },
  { src: '/images/顺德校区图书馆.jpg', name: '顺德校区图书馆' },
  { src: '/images/校本部正门.jpg', name: '校本部正门' },
  { src: '/images/龙舟.jpg', name: '龙舟' },
  { src: '/images/life.png', name: 'life' },
  { src: '/images/thoughts.jpg', name: 'thoughts' },
]

const active = ref(0)

function select(i: number) {
  active.value = i
}
</script>

<template>
  <div class="image-gallery">
    <div class="gallery-main">
      <transition name="gallery-fade" mode="out-in">
        <img
          :key="active"
          class="gallery-main-img"
          :src="images[active].src"
          :alt="images[active].name"
          loading="lazy"
        />
      </transition>
    </div>

    <div class="gallery-thumbs">
      <button
        v-for="(img, i) in images"
        :key="img.src"
        type="button"
        class="gallery-thumb"
        :class="{ active: i === active }"
        :title="img.name"
        :aria-label="'放大展示 ' + img.name"
        @click="select(i)"
      >
        <img :src="img.src" :alt="img.name" loading="lazy" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.image-gallery {
  width: 100%;
}

.gallery-main {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
  animation: schoolFadeIn 1.2s ease-out both;
}

.gallery-main-img {
  display: block;
  width: 100%;
  height: auto;
}

.gallery-thumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.gallery-thumb {
  width: 96px;
  height: 64px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  background: none;
  opacity: 0.7;
  cursor: pointer;
  transition: border-color 0.25s, opacity 0.25s, transform 0.25s;
}

.gallery-thumb img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-thumb:hover {
  opacity: 1;
  transform: translateY(-2px);
}

.gallery-thumb.active {
  border-color: var(--vp-c-brand-1);
  opacity: 1;
}

.gallery-fade-enter-active,
.gallery-fade-leave-active {
  transition: opacity 0.4s ease;
}

.gallery-fade-enter-from,
.gallery-fade-leave-to {
  opacity: 0;
}
</style>
