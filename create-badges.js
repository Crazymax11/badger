const createLink = require('./packages/shields-io-link');

const badges = {
    'eslint-errors': require('./packages/git-badger-eslint-errors-badge'),
    'eslint-warnings': require('./packages/git-badger-eslint-warnings-badge')
}

const eslint = require('eslint');

const engine = new eslint.CLIEngine();
const report = engine.executeOnFiles(['packages'])

const links = {
    'eslint-errors': createLink(badges['eslint-errors'].create(String(report.errorCount))),
    'eslint-warnings': createLink(badges['eslint-warnings'].create(String(report.warningCount)))
}

const fs = require('fs');
let mdContent = fs.readFileSync('README.md', 'utf-8');
mdContent = mdContent.replace(/!\[eslint-errors\]\(.*\)/, '![eslint-errors]('+links['eslint-errors']+')');
mdContent = mdContent.replace(/!\[eslint-warnings\]\(.*\)/, '![eslint-warnings]('+links['eslint-warnings']+')');

fs.writeFileSync('README.md', mdContent, 'utf-8');

