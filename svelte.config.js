import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter(),
        files: {
            lib: 'src/lib'
		},
		csp: {
			mode: 'hash',
			directives: {
				"default-src": ["self", "localhost:*", "data:", "ws:", "cdn.jsdelivr.net"]
			}
		}
    }
};

export default config;