module.exports = {
  extends: ['standard', 'plugin:prettier/recommended'],
  env: {
    node: true,
    browser: true,
  },
  globals: {
    describe: true,
    it: true,
    before: true,
    beforeEach: true,
    beforeAll: true,
    after: true,
    afterEach: true,
    afterAll: true,
    expect: true,
    jest: true,
  },
}
