module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "webextensions": true
    },
    "extends": "airbnb-base",
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
