// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['gsap'],
      exclude: ['gsap/ScrollTrigger'] // ScrollTrigger se debe cargar dinámicamente
    },
    ssr: {
      noExternal: ['gsap'] // Importante para SSR
    }
  }
});