module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint'
  ],
  parserOptions: {
    jsx: true,
    useJSXTextNode: true
  },
  plugins: ['@typescript-eslint', 'react-hooks'],
  settings: {
    react: {
      version: require('./package.json').dependencies.react
    }
  },
  rules: {
    // let prettier control indentation
    '@typescript-eslint/indent': 'off',

    // these two should be turned off & resolved pre-production, intended to make development less distracting
    '@typescript-eslint/no-explicit-any': 'off', // allowed to use 'any' without jackson pollocking the file
    '@typescript-eslint/explicit-function-return-type': 'off', // function does not have a return type
    '@typescript-eslint/member-delimiter-style': 'off', // semicolons to delemit interface properties? who cares!
    '@typescript-eslint/interface-name-prefix': 'off', // its ok to have interfaces start with IAnInterface
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    'import/no-duplicates': 'off',
    'import/no-unresolved': 'off'
  }
};
