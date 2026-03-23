// .vitepress/theme/index.js
import Layout from './Layout.vue'
import Incident from './components/Incident.vue'
import PullQuote from './components/PullQuote.vue'
import TwoCol from './components/TwoCol.vue'
import './style.css'

export default {
  Layout,
  enhanceApp({ app }) {
    app.component('Incident', Incident)
    app.component('PullQuote', PullQuote)
    app.component('TwoCol', TwoCol)
  }
}
