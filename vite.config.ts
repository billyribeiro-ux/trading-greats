import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, lazyPlugins } from "vite-plus";

export default defineConfig({
  staged: { "*": "vp check --fix" },
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  plugins: lazyPlugins(() => [
    tailwindcss(),
    sveltekit({
      preprocess: vitePreprocess(),
      adapter: adapter(),
      onwarn: (warning, handler) => {
        // Ignore warnings from SvelteKit generated files and internals.
        if (warning.filename?.includes(".svelte-kit/generated")) return;
        if (
          warning.code === "state_referenced_locally" &&
          warning.filename?.includes(".svelte-kit")
        )
          return;
        handler(warning);
      },
    }),
  ]),
  server: { fs: { allow: [".."] } },
  ssr: { noExternal: ["lucide-svelte"] },
  logLevel: "info",
});
