const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'enter your badge name (kebab case prefered, ex: eslint-erros)'
      },
      {
        type: 'input',
        name: 'description',
        message: 'enter your badge description'
      },
      {
        type: 'list',
        name: 'flow',
        message: 'Do you want flow types to better experience?',
        choices: ['yes', 'no']
      }
    ]).then(answers => {
      this.name = answers.name;
      this.description = answers.description;
      this.flow = answers.flow;
    });
  }
  writing() {
    this.fs.copyTpl(
      this.templatePath(`index.js${this.flow}` ? '.flow' : ''),
      this.destinationPath('index.js'),
      {
        badgeName: this.badgeName,
        badgeDescription: this.badgeDescription
      }
    );
    this.fs.copyTpl(
      this.templatePath(`_package.json`),
      this.destinationPath('package.json'),
      {
        badgeName: this.badgeName,
        badgeDescription: this.badgeDescription
      }
    );
    this.fs.copyTpl(
      this.templatePath('spec.js'),
      this.destinationPath('spec.js')
    );
    
    this.npmInstall(['chai', 'mocha');
  }
};
