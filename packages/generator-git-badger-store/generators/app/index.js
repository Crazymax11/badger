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
      this.templatePath(`index.js`),
      this.destinationPath('index.js'),
      {
        name: this.name,
        description: this.description,
        flow: this.flow
      }
    );
    this.fs.copyTpl(
      this.templatePath(`_package.json`),
      this.destinationPath('package.json'),
      {
        name: this.name,
        description: this.description
      }
    );
    this.fs.copyTpl(
      this.templatePath('spec.js'),
      this.destinationPath('spec.js'),
      {
        name: this.name,
        description: this.description
      }
    );
    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      this.destinationPath('.babelrc'),
      {
        name: this.name,
        description: this.description
      }
    );
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
      {
        name: this.name,
        description: this.description
      }
    );

    const deps = [
      'chai',
      'mocha',
      'git-badger-store-tests',
      'webpack',
      'babel-loader',
      'babel-core',
      'babel-preset-env',
      'babel-preset-flow',
      'webpack-node-externals',
      'eslint'
    ];
    if (this.flow) deps.push('flow-bin');
    this.npmInstall(deps, { 'save-dev': true });
  }
};
