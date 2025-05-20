// import globals from 'globals'
// import pluginJs from '@eslint/js'
// import tseslint from 'typescript-eslint'
// import pluginVue from 'eslint-plugin-vue'
// import eslintConfigPrettier from 'eslint-config-prettier'
// import eslintrcImport from './src/renderer/src/.eslintrc-auto-import.json' with { type: 'json' }

// /** @type {import('eslint').Linter.Config[]} */
export default [
  {}
  // eslintConfigPrettier,
  // {
  //   ignores: [
  //     '**/node_modules/',
  //     '**/public/',
  //     '**/dist/',
  //     '**/logs/',
  //     '**/build/',
  //     '**/.*/',
  //     '**/resources/',
  //     '**/assets/',
  //     '**/out/',
  //     '**/*.d.ts',
  //     '**/*.config.js',
  //     '**/*.*.cjs'
  //   ]
  // },
//   {
//     files: ['**/*.{js,mjs,cjs,ts,vue}']
//   },
//   {
//     languageOptions: {
//       globals: {
//         ...globals.browser,
//         ...eslintrcImport.globals
//       }
//     }
//   },
//   pluginJs.configs.recommended,
//   ...tseslint.configs.recommended,
//   ...pluginVue.configs['flat/recommended'],
//   {
//     files: ['**/*.vue'],
//     languageOptions: {
//       parserOptions: {
//         parser: tseslint.parser
//       }
//     }
//   },
//   {
//     rules: {
//       semi: ['error', 'always'],
//       quotes: [
//         'error',
//         'single',
//         {
//           allowTemplateLiterals: true
//         }
//       ],
//       'no-debugger': ['warn'],
//       '@typescript-eslint/no-unused-vars': ['off'],
//       '@typescript-eslint/no-explicit-any': ['off'],
//       '@typescript-eslint/no-unused-expressions': [
//         'error',
//         {
//           allowShortCircuit: true, // 允许短路操作符的使用 (如 `a && b`)
//           allowTernary: true // 允许三元操作符
//         }
//       ],
//       'turbo/no-undeclared-env-vars': [
//         'off',
//         {
//           allowList: ['([a-zA-Z]+)\.env[\[\].]([a-zA-Z]+)']
//         }
//       ],
//       'vue/multi-word-component-names': [
//         'error',
//         {
//           ignores: ['app', 'index', 'delete']
//         }
//       ],
//       'vue/no-v-html': ['off']
//     }
//   }
]
