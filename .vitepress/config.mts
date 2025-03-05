import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "GestSIS Doc",
  description: "GestSIS Documentation",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Accueil', link: '/index' },
      { text: 'GestSIS', link: 'https://gestsis.ch', target: '_blank' }
    ],

    sidebar: [
      {
        text: 'Guides',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples', },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Ph0tonic/GestSIS_Doc' },
    ]
  }
})
