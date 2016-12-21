'use strict';
const _ = require('lodash');

module.exports = (file, api, options) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  const replaceNavigation = p => {
    _.merge(p.node, {name: 'History'});
    return p.node;
  };

  const replaceTransitionTo = p => {
    const functionArguments = p.parent.node.arguments;
    functionArguments.unshift(j.literal(null));

    return j.memberExpression(
      j.memberExpression(
        j.thisExpression(),
        j.identifier('history')
      ), j.identifier('pushState'));
  };

  const replaceReplaceWith = p => {
    const functionArguments = p.parent.node.arguments;
    functionArguments.unshift(j.literal(null));

    return j.memberExpression(
      j.memberExpression(
        j.thisExpression(),
        j.identifier('history')
      ), j.identifier('replaceState'));
  };

  const replaceGoBack = () => {
    return j.memberExpression(
      j.memberExpression(
        j.thisExpression(),
        j.identifier('history')
      ), j.identifier('goBack'));
  };

  root.find(j.Identifier, {name: 'Navigation'})
    .replaceWith(replaceNavigation);

  root.find(j.MemberExpression, {
    object: {type: 'ThisExpression'},
    property: {type: 'Identifier', name: 'transitionTo'},
  })
    .replaceWith(replaceTransitionTo);

  root.find(j.MemberExpression, {
    object: {type: 'ThisExpression'},
    property: {type: 'Identifier', name: 'replaceWith'},
  })
    .replaceWith(replaceReplaceWith);

  root.find(j.MemberExpression, {
    object: {type: 'ThisExpression'},
    property: {type: 'Identifier', name: 'goBack'},
  })
    .replaceWith(replaceGoBack);

  return root.toSource({quote: 'single'});
};

module.exports.parser = 'flow';
