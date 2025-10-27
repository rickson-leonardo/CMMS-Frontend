/**
 * @file main.js
 * @description Ponto de entrada principal da aplicação Vue.
 * Inicializa a app, o router, o store (futuramente) e importa estilos globais.
 * @path src/main.js
 * @version 1.3.0 - Remove importação global de CSS do FullCalendar (tentativa via index.html)
 * @date 2025-10-24
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Importa a configuração do router

// Importa os estilos globais (Design Tokens)
import '@/styles/_variables.css'

// ***** REMOVIDAS IMPORTAÇÕES GLOBAIS CSS FULLCALENDAR *****
// import '@fullcalendar/core/main.css';
// import '@fullcalendar/daygrid/main.css';
// import '@fullcalendar/timegrid/main.css';
// import '@fullcalendar/list/main.css';
// ***** FIM REMOÇÃO *****

const app = createApp(App)

app.use(router) // Diz ao app para usar o router

// Garante que o roteador está pronto antes de montar a app
router.isReady().then(() => {
  app.mount('#app')
})

