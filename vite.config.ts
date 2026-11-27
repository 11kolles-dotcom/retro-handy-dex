import { defineConfig } from 'vite';
import pkg from './package.json' with { type: 'json' };

// Relative base so the app works under https://<user>.github.io/<repo>/
export default defineConfig({
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(`v${pkg.version}`),
  },
});
