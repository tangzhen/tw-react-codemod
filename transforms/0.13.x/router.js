'use strict';
const _ = require('lodash');

module.exports = (file, api, options) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  const replaceRoute = p => {
    _.remove(p.node.attributes, {name: {name: 'name'}});
    const itemHasHandler = _.find(p.node.attributes, {name: {name: 'handler'}});
    if (itemHasHandler) {
      _.set(itemHasHandler, 'name.name', 'component');
    }

    return p.node;
  };

  const replaceDefaultRoute = p => {
    _.remove(p.node.attributes, {name: {name: 'name'}});
    _.find(p.node.attributes, {name: {name: 'handler'}}).name.name = 'component';
    _.merge(p.node, {name: 'IndexRoute'});

    return p.node;
  };

  root.find(j.Identifier, {name: 'DefaultRoute'})
    .replaceWith((p) => {
      _.merge(p.node, {name: 'IndexRoute'});
      return p.node;
    });

  root.find(j.JSXOpeningElement, {
    name: {name: 'Route'}
  })
    .replaceWith(replaceRoute);

  root.find(j.JSXOpeningElement, {
    name: {name: 'DefaultRoute'}
  })
    .replaceWith(replaceDefaultRoute);

  return root.toSource();
};
