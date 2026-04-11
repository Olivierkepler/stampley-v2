// Use a string plugin key so PostCSS loads `@tailwindcss/postcss` via Node at runtime.
// A static `import` from this package pulls in `lightningcss` and breaks Turbopack (native `.node` resolution).
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
