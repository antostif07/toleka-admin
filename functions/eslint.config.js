const { FlatCompat } = require("@eslint/eslintrc");
const globals = require("globals");
const js = require("@eslint/js");
const ts = require("typescript-eslint");

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

module.exports = [
    js.configs.recommended,
    ...ts.configs.recommended,
    ...compat.extends("google"),
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
        rules: {
            "require-jsdoc": "off",
            "valid-jsdoc": "off",
            "new-cap": "off",
        }
    },
];