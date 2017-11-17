const createLink = require('shields-io-link');

const badges = {
    'eslint-errors': require('git-badger-eslint-errors-badge'),
    'eslint-warnings': require('git-badger-eslint-warnings-badge')
}

const eslint = require('eslint');

const report = eslint.CLIEngine.executeOnFiles(['/packages'])


