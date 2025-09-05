import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, bytecodePlugin } from 'electron-vite'

import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'
// import Icons from 'unplugin-icons/vite'
// import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import { ElementPlusIconsResolver } from './autoImportIcon.custom'

// const ElementPlusIconsResolver = () => {
//   return (name: string) => {
//     // 以大写字母开头的认为是 element-plus 图标
//     console.log('🐦‍🔥 name', name)
//     const icons = ['Edit', 'Delete', 'Search', 'Plus', 'Minus']
//     if (icons.includes(name)) {
//       return { importName: name, path: '@element-plus/icons-vue' }
//     }
//   }
// }

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@': resolve('src/renderer/src'),
        '@renderer': resolve('src/renderer/src'),
        '@components': resolve('src/renderer/src/components'),
        '@views': resolve('src/renderer/src/views'),
        '@stores': resolve('src/renderer/src/stores'),
        '@directives': resolve('src/renderer/src/directives'),
        '@assets': resolve('src/renderer/src/assets'),
        // '@config': resolve('src/renderer/src/config'),
        '@utils': resolve('src/renderer/src/utils'),
        '@service': resolve('src/renderer/src/service')
      }
    },
    plugins: [
      vue(),
      eslint({
        exclude: ['**/node_modules/**']
      }),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/ // .md
        ],
        imports: [
          // presets
          'vue',
          'vue-router',
          {
            vue: ['withDefaults']
          }
        ],
        dirs: ['./src'],
        resolvers: [
          ElementPlusResolver()
          // 自动导入图标组件
        ],
        dts: './src/auto-imports.d.ts',
        vueTemplate: false,
        eslintrc: {
          enabled: true, // Default `false`
          filepath: './src/renderer/src/.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        }
      }),
      Components({
        dirs: ['./src/views/'],
        extensions: ['vue', 'md'],
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        allowOverrides: process.platform === 'darwin',
        resolvers: [
          // 自动注册图标组件
          ElementPlusResolver({ importStyle: false }),
          ElementPlusIconsResolver({ prefix: 'Use' })
        ],
        dts: './src/components.d.ts',
        types: []
      })
    ]
  }
})
