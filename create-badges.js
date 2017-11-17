const fs = require('fs');
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


let mdContent = fs.readFileSync('README.md', 'utf-8');
mdContent = Object.entries(links).reduce((md, [badge, link]) => 
    md.replace(new RegExp('!\\['+badge+'\\]\\(.*\\)'), '![' + badge + '](' + link + ')')
, mdContent)

fs.writeFileSync('README.md', mdContent, 'utf-8');

