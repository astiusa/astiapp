'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var randomWords = require('random-words');
var randomString = require('random-string');

var AstiappGenerator = module.exports = function AstiappGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(AstiappGenerator, yeoman.generators.Base);

AstiappGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  console.log(this.yeoman);

  var prompts = [{
    name: 'appName',
    message: 'App name?'
  }];

  this.prompt(prompts, function (props) {
    this.appName = props.appName;

    cb();
  }.bind(this));
};

AstiappGenerator.prototype.app = function app() {
  this.randomPhrase = randomWords(5).join(' ');
  this.randomCookie = randomString({length: 20});

  this.mkdir('app');
  this.mkdir('app/templates');

  this.template('_package.json', 'package.json');
  this.template('_bower.json', 'bower.json');
  this.template('_app.js', 'app.js');
};

AstiappGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};
