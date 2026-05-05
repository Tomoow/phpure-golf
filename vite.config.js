import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { readdirSync, statSync } from 'node:fs';

// Auto-discover every *.preview.html inside components/ and pages/ so each
// component has its own URL in the Vite dev server.
function discoverPreviewPages(roots) {
    const entries = { main: resolve(process.cwd(), 'index.html') };
    for (const root of roots) {
        const abs = resolve(process.cwd(), root);
        try {
            walk(abs, (filePath) => {
                if (filePath.endsWith('preview.html')) {
                    const key = filePath.replace(process.cwd() + '/', '').replace(/\//g, '_').replace(/\.html$/, '');
                    entries[key] = filePath;
                }
            });
        } catch {
            // Directory may not exist yet in Phase 0; ignore.
        }
    }
    return entries;
}

function walk(dir, cb) {
    for (const name of readdirSync(dir)) {
        const p = resolve(dir, name);
        const s = statSync(p);
        if (s.isDirectory()) walk(p, cb);
        else cb(p);
    }
}

export default defineConfig({
    root: process.cwd(),
    plugins: [tailwindcss()],
    server: {
        // Honor the PORT env var when present (Claude Preview injects this for
        // the launch.json `autoPort` flow). Falls back to 5173 for plain
        // `npm run dev` from a developer's terminal.
        port: process.env.PORT ? Number(process.env.PORT) : 5173,
        strictPort: false,
        open: false,
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: discoverPreviewPages(['components', 'pages']),
        },
    },
});
