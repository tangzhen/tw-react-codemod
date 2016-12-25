'use strict';
const _ = require('lodash');
const routerPath = require('./routePath');

module.exports = (file, api, options) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  const replaceNavigation = p => {
    _.merge(p.node, {name: 'History'});
    return p.node;
  };

  const getRoutePath = routeName => {
    let newVar = _.get(routerPath, routeName) || routeName;
    return newVar;
  };

  const addParameterState = p => {
    let functionArguments = p.parent.node.arguments;
    if (_.get(p, 'parent.node.property.name') === 'bind') {
      functionArguments = p.parent.parent.node.arguments;
      functionArguments[1] = j.literal(getRoutePath(functionArguments[1].value));
    } else {
      functionArguments[0] = j.literal(getRoutePath(functionArguments[0].value));
    }

    functionArguments.unshift(j.literal(null));
  };

  const createHistoryMemberExpression = functionName => {
    return j.memberExpression(
      j.memberExpression(
        j.thisExpression(),
        j.identifier('history')
      ), j.identifier(functionName));
  };

  const replaceTransitionTo = p => {
    addParameterState(p);

    return createHistoryMemberExpression('pushState');
  };

  const replaceReplaceWith = p => {
    addParameterState(p);

    return createHistoryMemberExpression('replaceState');
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
