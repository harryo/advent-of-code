module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'airbnb',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  // ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'import/extensions': ['error', 'ignorePackages'],
    'import/no-unresolved': ['error', { ignore: ['^@/'] }],
    'no-console': 'off',
    'no-bitwise': 'off',
    'max-len': ['error', { code: 120 }],
    'no-use-before-define': ['error', { functions: false, classes: false }],
    camelcase: ['error', { ignoreDestructuring: true }],
    'no-multi-str': 'off',
    'no-plusplus': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },

};
