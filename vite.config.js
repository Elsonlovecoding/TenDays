import { defineConfig } from 'vite';

// GitHub Pages serves this project at https://elsonlovecoding.github.io/TenDays/
// so every built asset URL needs the /TenDays/ prefix.
export default defineConfig({
  base: '/TenDays/',
});
