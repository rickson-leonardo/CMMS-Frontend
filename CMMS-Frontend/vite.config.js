/**
 * @file vite.config.js
 * @description Configuração do Vite para o projeto CMMS Frontend.
 * Inclui alias de path e exclusão de CSS do FullCalendar da otimização.
 * @path ./vite.config.js
 * @version 1.1.0 - Adiciona optimizeDeps.exclude para FullCalendar CSS
 * @date 2025-10-24
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // Importa o módulo 'path' do Node.js

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Define o alias '@' para a pasta src
    },
  },
  // *** NOVA CONFIGURAÇÃO ***
  optimizeDeps: {
    exclude: [
      '@fullcalendar/core/main.css', // Tenta excluir o CSS do core da otimização
      '@fullcalendar/daygrid/main.css', // Tenta excluir o CSS do daygrid da otimização
      '@fullcalendar/timegrid/main.css', // Tenta excluir o CSS do timegrid da otimização
      '@fullcalendar/list/main.css', // Tenta excluir o CSS do list da otimização
      // Adicione outros CSS do FullCalendar se necessário
    ]
  },
  // *** FIM DA NOVA CONFIGURAÇÃO ***
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})

