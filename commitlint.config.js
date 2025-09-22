/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "test",
        "build",
        "ci",
        "perf",
        "revert",
        "chore",
      ],
    ],
    "scope-case": [2, "always", ["kebab-case", "lower-case"]],
    "subject-case": [2, "never", ["sentence-case"]],
  },
};
