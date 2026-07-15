import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextVitals,
  {
    ignores: [".next/**", ".worktrees/**", ".local-backups/**", "node_modules/**", "work/**", "outputs/**", "dist/**", "out/**"]
  }
];

export default eslintConfig;
