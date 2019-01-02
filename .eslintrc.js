module.exports = {
    "env": {
        "browser": true,
        "webextensions": true
    },
    "extends": "airbnb-base",
    "parserOptions": {
        "ecmaVersion": 6
    },
    "rules": {
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": [
            "warn",
            { allow: ["warn", "error"] }
        ]
    }
};
