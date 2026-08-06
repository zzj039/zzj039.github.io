import { defineConfig } from 'vitepress'
import type MarkdownIt from 'markdown-it'

export default defineConfig({
  title: 'zjz的小站',
  description: '记录日常、学习与碎笔',
  markdown: {
    config(md: MarkdownIt) {
      // 给所有表格包一层 .table-wrapper，实现自适应宽度 + 窄屏横向滚动
      const tableOpen = md.renderer.rules.table_open
      const tableClose = md.renderer.rules.table_close
      md.renderer.rules.table_open = (tokens, idx, options, env, self) => {
        const inner = tableOpen
          ? tableOpen(tokens, idx, options, env, self)
          : self.renderToken(tokens, idx, options)
        return '<div class="table-wrapper">' + inner
      }
      md.renderer.rules.table_close = (tokens, idx, options, env, self) => {
        const inner = tableClose
          ? tableClose(tokens, idx, options, env, self)
          : self.renderToken(tokens, idx, options)
        return inner + '</div>'
      }
    },
  },
  themeConfig: {
    logo: '/images/章鱼哥.jpg',
    lastUpdated: {
      text: '最近更新',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '生活', link: '/life/' },
      { text: '学习', link: '/study/' },
      { text: '碎笔', link: '/thoughts/' },
    ],
    sidebar: {
      '/life/': [
        {
          text: '生活',
          collapsed: false,
          items: [
            {
              text: '本科（南方医科大学）',
              collapsed: true,
              items: [
                { text: '项目经历', link: '/life/undergraduate-project' },
                { text: '向前辈学习', link: 'https://ilovesmu.github.io/' },
                {
                  text: '无意中找到的医学影像处理教程',
                  link: 'https://datawhalechina.github.io/med-imaging-primer/',
                },
              ],
            },
            { text: '研究生（南方医科大学）', collapsed: true, items: [] },
            { text: '运动', collapsed: true, items: [] },
            { text: '影视', collapsed: true, items: [
               { text: '已观看/未观看', link: '/life/TVshows_and_movies' },
               { text: '观影链接', link: 'https://www.libvio.io/' },
            ] },
          ],
        },
      ],
      '/study/': [
        {
          text: '学习',
          collapsed: false,
          items: [
            { text: '研究生', collapsed: true, items: [] },
            { text: '理财', collapsed: true, items: [] },
            { text: '认知提升', collapsed: true, items: [] },
          ],
        },
      ],
      '/thoughts/': [
        {
          text: '碎笔',
          collapsed: false,
          items: [
            { text: '开头的话', link: '/thoughts/start' },
          ],
        },
      ],
    },
  },
})