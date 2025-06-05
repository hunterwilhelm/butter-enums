import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Butter Enums",
  description: "Type-safe specialized enums for TypeScript",
  base: '/butter-enums/',
  head: [
    ['link', { rel: 'icon', href: 'favicon.ico', type: 'image/x-icon' }]
  ],
  themeConfig: {
    
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/hunterwilhelm/butter-enums' }
    ]
  },
  markdown: {
    codeTransformers: [
      transformerTwoslash({
      })
    ],
    languages: ['js', 'jsx', 'ts', 'tsx'],
  },
})
