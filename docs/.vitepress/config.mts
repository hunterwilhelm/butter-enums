import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Butter Enums",
  description: "Type-safe specialized enums for TypeScript",
  head: [
    ['link', { rel: 'icon', href: 'favicon.ico', type: 'image/x-icon' }],
    ['meta', { property: 'og:image', content: 'https://butter-enums.hunterwilhelm.com/og.png' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Butter Enums' }],
    ['meta', { property: 'og:description', content: 'Easy to use, type-safe specialized enums for TypeScript' }],
    ['meta', { property: 'og:url', content: 'https://butter-enums.hunterwilhelm.com' }],
    ['meta', { property: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { property: 'twitter:title', content: 'Butter Enums' }],
    ['meta', { property: 'twitter:description', content: 'Easy to use, type-safe specialized enums for TypeScript' }],
    ['meta', { property: 'twitter:image', content: 'https://butter-enums.hunterwilhelm.com/og.png' }],
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
