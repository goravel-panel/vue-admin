import js from '@eslint/js'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import eslintPluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: ["node_modules", "scripts", "auto-imports.d.ts", "components.d.ts"],
  },
  /** JS 推荐配置 */
  js.configs.recommended,
  /** TS 推荐配置 */
  ...tseslint.configs.recommended,
  /** Vue 推荐配置 */
  ...eslintPluginVue.configs["flat/recommended"],
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      // 强制组件顶级元素的顺序
      'vue/block-order': [2, {
        order: [['script', 'template'], 'style']
      }],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
      "no-undef": "off",
      "no-console": "off",
      "vue/multi-word-component-names": "off",
      "vue/prefer-import-from-vue": "off",
      "no-prototype-builtins": "off",
      "prefer-spread": "off",
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: "module",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        globals: {
          Atomics: "readonly",
          SharedArrayBuffer: "readonly",
        },
      },
    },
  },
];