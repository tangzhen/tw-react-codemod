'use strict';
const _ = require('lodash');
const routerPath = require('./routePath');

module.exports = (file, api, options) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  const statement = j.template.statement;

  const replaceNavigation = p => {
    _.merge(p.node, {name: 'History'});
    return p.node;
  };

  const getRoutePath = routeName => _.get(routerPath, routeName) || routeName;

  root.find(j.Identifier, {name: 'Navigation'})
    .replaceWith(replaceNavigation);

  const functionFilter = (functionName, withBind = false) => {
    const functionNameFilter = {
      type: 'MemberExpression',
      object: {
        type: 'ThisExpression'
      },
      property: {
        name: functionName
      }
    };

    if (withBind) {
      return {
        callee: {
          type: 'MemberExpression',
          object: functionNameFilter,
          property: {
            name: 'bind'
          }
        }
      };
    } else {
      return {
        callee: functionNameFilter
      };
    }
  };

  const changeToHistoryFunction = (functionName, withBind, p) => {
    const args = p.node.arguments;
    const routerNameIndex = withBind ? 1 : 0;

    if (typeof args[routerNameIndex].value === 'string') {
      const newRouterName = getRoutePath(args[routerNameIndex].value);
      args[routerNameIndex] = j.literal(newRouterName);
    }

    return withBind
      ? statement`this.history.${functionName}.bind(null, ${args})`
      : statement`this.history.${functionName}(null, ${args})`;
  };

  // Change `this.transitionTo` to `this.history.pushState`
  root.find('CallExpression', functionFilter('transitionTo'))
    .replaceWith(changeToHistoryFunction.bind(null, 'pushState', false));

  // Change `this.transitionTo.bind` to `this.history.transitionTo.bind`
  root.find('CallExpression', functionFilter('transitionTo', true))
    .replaceWith(changeToHistoryFunction.bind(null, 'pushState', true));

  // Change `this.replaceWith` to `this.history.replaceState`
  root.find('CallExpression', functionFilter('replaceWith'))
    .replaceWith(changeToHistoryFunction.bind(null, 'replaceState', false));

  // Change `this.replaceWith.bind` to `this.history.replaceState.bind`
  root.find('CallExpression', functionFilter('replaceWith', true))
    .replaceWith(changeToHistoryFunction.bind(null, 'replaceState', true));

  // Change `this.goBack` to `this.history.goBack`
  root.find('CallExpression', functionFilter('goBack'))
    .replaceWith(p => statement`this.history.goBack()`);

  return root.toSource({quote: 'single'});
};

module.exports.parser = 'flow';
