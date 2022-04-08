module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0, 'always', 'sentence-case'],
  },
  helpUrl:
    'Please follow git commit convention at https://www.conventionalcommits.org/en/v1.0.0/\n Or https://github.com/conventional-changelog/commitlint/#what-is-commitlint. \nEdit commit message with VS Code extension: https://marketplace.visualstudio.com/items?itemName=adam-bender.commit-message-editor',
};
