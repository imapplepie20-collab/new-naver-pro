import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        host: true,     // 외부 접속 허용 (0.0.0.0)
        port: 5173,     // 포트 번호
        allowedHosts: ['imapplepie20.tplinkdns.com', '.tplinkdns.com', 'localhost', '127.0.0.1'], // 허용할 호스트
    },
})
