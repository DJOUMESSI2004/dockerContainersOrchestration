import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // !!! Change this to your local IP address or domain name if needed (to access the app out of docker)
    port: 3005, 
  },
})
