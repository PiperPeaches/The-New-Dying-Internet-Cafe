import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  ssr: {
    // These libraries must be bundled by Vite to work with SvelteKit's SSR
    noExternal: ['three', 'postprocessing', '@threlte/core']
  }
});