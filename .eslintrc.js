
module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es6": true,
    },
    "globals": {
        webIpc: true,
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module",
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        "no-console": 0,
        // "indent": [
        //     "error",
        //     "tab"
        // ],
        // "linebreak-style": [
        //     "error",
        //     "windows"
        // ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};