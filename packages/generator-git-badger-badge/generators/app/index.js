const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'badgeName',
        message: 'enter your badge name (kebab case prefered, ex: eslint-erros)'
      },
      {
        type: 'input',
        name: 'badgeDescription',
        message: 'enter your badge description'
      }
    ]).then(answers => {
      this.badgeName = answers.badgeName;
      this.badgeDescription = answers.badgeDescription;
    });
  }
  writing() {
    this.fs.copyTpl(
      this.templatePath('index.js'),
      this.destinationPath('index.js'),
      {
        badgeName: this.badgeName,
        badgeDescription: this.badgeDescription
      }
    );
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      {
        badgeName: this.badgeName,
        badgeDescription: this.badgeDescription
      }
    );
  }
};
