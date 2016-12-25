'use strict';
const _ = require('lodash');

module.exports = (file, api, options) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  const replaceRoute = p => {
    _.remove(p.node.attributes, {name: {name: 'name'}});
    _.find(p.node.attributes, {name: {name: 'handler'}}).name.name = 'component';

    return p.node;
  };

  root.find(j.JSXOpeningElement, {
    name: {name: 'Route'}
  })
    .replaceWith(replaceRoute);

  return root.toSource();
};
