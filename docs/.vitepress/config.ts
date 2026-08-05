import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '我的个人小站',
  description: '记录日常、学习与感想',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '生活', link: '/life/' },
      { text: '学习', link: '/study/' },
      { text: '感想', link: '/thoughts/' },
    ],
    sidebar: {
      '/life/': [
        {
          text: '生活',
          items: [
            { text: '第一篇日记', link: '/life/2025-08-05' },
          ],
        },
      ],
      '/study/': [
        {
          text: '学习',
          items: [
            { text: 'Markdown 入门', link: '/study/markdown' },
          ],
        },
      ],
      '/thoughts/': [
        {
          text: '感想',
          items: [
            { text: '开头的话', link: '/thoughts/start' },
          ],
        },
      ],
    },
  },
})