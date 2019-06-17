module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "react-app",
    "plugin:prettier/recommended",
    "prettier/prettier"
  ],
  plugins: ["@typescript-eslint", "react", "prettier"],
  settings: {
    react: {
      version: require("./package.json").dependencies.react
    }
  },
  "rules": {
    // let prettier control indentation
    "@typescript-eslint/indent": "off",

    // these two should be turned off & resolved pre-production, intended to make development less distracting
    "@typescript-eslint/no-explicit-any": "off", // allowed to use 'any' without jackson pollocking the file
    "@typescript-eslint/explicit-function-return-type": "off", // function does not have a return type
    "@typescript-eslint/member-delimiter-style": "off", // semicolons to delemit interface properties? who cares!
    "@typescript-eslint/interface-name-prefix": "off" // its ok to have interfaces start with IAnInterface
  }
};
