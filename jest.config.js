const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    // 1. Resolve path aliases (@/ -> root directory)
    "^@/(.*)$": "<rootDir>/$1",
    // 2. Mock SCSS/CSS imports so Jest doesn't throw module errors on stylesheets
    "\\.(css|scss|sass)$": "<rootDir>/global.d.ts",
    "^next/font/google$": "<rootDir>/__mocks__/nextFontGoogleMock.ts",
  },
};
