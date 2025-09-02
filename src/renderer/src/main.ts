import { createApp, reactive } from 'vue'

// import './assets/main.css'

import App from './App.vue'
import router from './router'
import stores from './stores'
// Global customize directives
// import directives from './directives';

const app = createApp(App).use(stores).use(router)
// .use(directives)

app.mount('#app')

export default app
