'use strict';

const TransformFilter = require('./lib/transform-filter');

module.exports = {
  name: 'ember-cli-transforms',

  included(app) {
    this._super.included.apply(this, arguments);
    this.isProductionBuild = app.env === 'production';
    this.preOptions = generateOptions(app.options.transforms || {}, true);
    this.postOptions = generateOptions(app.options.transforms || {}, false);
  },

  postprocessTree(type, tree) {
    return new TransformFilter(tree, this.postOptions);
  },
  preprocessTree(type, tree) {
    return new TransformFilter(tree, this.preOptions);
  }
};

function generateOptions(options, preprocess) {
  if (options.extensions && !Array.isArray(options.extensions)) {
    throw new Error('`transforms.extensions` must be an array of file extensions');
  }
  if (options.targets && !Array.isArray(options.targets)) {
    throw new Error('`transforms.targets` must be an array of transforms');
  }
  if (options.targets && options.targets.find(t => !t.pattern)) {
    throw new Error('`transforms.targets`: all transforms require a `pattern` string');
  }
  var tmp = Object.assign({
    targets: [],
    extensions: ['html', 'js', 'css']
  }, options);
  tmp.targets = tmp.targets.filter(function (x) {
    return preprocess ? x.preprocess : !x.preprocess;
  });
  return tmp;
}
