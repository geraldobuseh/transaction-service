import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const rootEnvDirectory = path.resolve(currentDirectory, '..');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootEnvDirectory, '');
  const backendProxyTarget =
    env.VITE_BACKEND_PROXY_TARGET || env.VITE_API_BASE_URL || 'http://localhost:8080';

  return {
    envDir: rootEnvDirectory,
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: backendProxyTarget,
          changeOrigin: true
        }
      }
    }
  };
});
