import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/api': {
				target: process.env.VITE_API_URL || 'https://rep-nvjm.onrender.com',
				changeOrigin: true
			}
		}
	},
	build: {
		outDir: 'build',
		rollupOptions: {
			output: {
				manualChunks: {
					'vendor': ['svelte']
				}
			}
		}
	}
});
