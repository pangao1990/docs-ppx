import { h } from 'vue'
import { useRoute, withBase } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import LegacyBanner from './LegacyBanner.vue'
import './custom.css'

const Layout = {
  setup() {
    const route = useRoute()
    const legacyPrefixes = [
      withBase('/v5/'),
      withBase('/guide/'),
      withBase('/api/'),
    ]
    const isLegacyPage = () => legacyPrefixes.some(prefix => route.path.startsWith(prefix))

    return () => h(DefaultTheme.Layout, null, {
      'doc-before': () => isLegacyPage() ? h(LegacyBanner) : null,
      'home-hero-before': () => isLegacyPage() ? h('div', { class: 'legacy-home-notice' }, [h(LegacyBanner)]) : null,
    })
  },
}

export default {
  extends: DefaultTheme,
  Layout,
}
