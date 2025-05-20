import { resolve } from "path";
import {
  defineConfig,
  externalizeDepsPlugin,
  bytecodePlugin,
} from "electron-vite";
import vue from "@vitejs/plugin-vue";
import eslint from "vite-plugin-eslint";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        "@": resolve("src/renderer/src"),
        "@renderer": resolve("src/renderer/src"),
        "@components": resolve("src/renderer/src/components"),
        "@views": resolve("src/renderer/src/views"),
        // "@stores": resolve("src/renderer/src/stores"),
        // "@directives": resolve("src/renderer/src/directives"),
        // "@constructors": resolve("src/renderer/src/constructors"),
        "@config": resolve("src/renderer/src/config"),
        // "@service": resolve("src/renderer/src/service"),
        // "@api": resolve("src/renderer/src/api"),
        // "@utils": resolve("src/renderer/src/utils"),
      },
    },
    plugins: [
      vue(),
      eslint({
        exclude: ["**/node_modules/**"],
      }),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/, // .md
        ],
        imports: [
          // presets
          "vue",
          "vue-router",
          {
            vue: ["withDefaults"],
          },
        ],
        dirs: ["./src"],
        resolvers: [ElementPlusResolver()],
        dts: "./src/auto-imports.d.ts",
        vueTemplate: false,
        eslintrc: {
          enabled: true, // Default `false`
          filepath: "./src/renderer/src/.eslintrc-auto-import.json", // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        },
      }),
      Components({
        dirs: process.platform === "darwin" ? ["./src/"] : ["./src/"],
        // allow auto load markdown components under `./src/components/`
        extensions: ["vue", "md"],
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        allowOverrides: process.platform === "darwin",
        resolvers: [ElementPlusResolver({ importStyle: false })],
        dts: "./src/components.d.ts",
        types: [],
      }),
    ],
  },
});
