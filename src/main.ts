import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const savedTheme = localStorage.getItem('theme') || 'dark'

document.documentElement.setAttribute('data-theme', savedTheme)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
