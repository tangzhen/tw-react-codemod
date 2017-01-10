'use strict';
const _ = require('lodash');
const {renameJSXElement, removeJSXElementAttribute, renameJSXElementAttribute} = require('../utils/ReactUtils');
const {renameIdentifier} = require('../utils/JSUtils');

module.exports = (file, api, options) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  const template = j.template;

  const changeRoute = p => {
    removeJSXElementAttribute(p, 'name');
    renameJSXElementAttribute(p, 'handler', 'component');

    return p.node;
  };

  const changeDefaultRoute = p => {
    removeJSXElementAttribute(p, 'name');
    renameJSXElementAttribute(p, 'handler', 'component');
    renameJSXElement(p, 'IndexRoute');

    return p.node;
  };

  const removeRouteHandlerRequire = p => {
    _.remove(p.node.properties, {value: {name: 'RouteHandler'}});
    return p.node;
  };

  const replaceRouteHandler = () => {
    return j.jsxExpressionContainer(template.expression`this.props.children`);
  };

  const isRequireModuleDeclarator = (path, moduleName) => {
    const callExpression = path.node.init;

    return (
      callExpression.type === 'CallExpression' &&
      callExpression.callee.type === 'Identifier' &&
      callExpression.callee.name === 'require' &&
      callExpression.arguments.length === 1 &&
      callExpression.arguments[0].type === 'Literal' &&
      callExpression.arguments[0].value === moduleName
    );
  };

  const isObjectPattern = (path) => {
    return path.node.id.type === 'ObjectPattern';
  };

  const isRouteHandlerDeclaration = function(p) {
    return p.node.declarations[0].id.name == 'RouteHandler';
  };

  root.find(j.VariableDeclaration)
    .filter(isRouteHandlerDeclaration)
    .remove();

  root.findJSXElements('Route')
    .forEach(changeRoute);

  root.find(j.VariableDeclarator, {name: 'DefaultRoute'})
    .forEach(p => {
      renameIdentifier(p, 'IndexRoute');
    });

  root.find(j.Identifier, {name: 'DefaultRoute'})
    .forEach(p => {
      renameIdentifier(p, 'IndexRoute');
    });

  root.findJSXElements('IndexRoute')
    .forEach(changeDefaultRoute);

    root.find(j.VariableDeclarator)
    .filter(p => {
      return isRequireModuleDeclarator(p, 'react-router');
    })
    .filter(isObjectPattern)
    .replaceWith(p => template.statement`${p.node.id} = ${p.node.init}`);

  root.findJSXElements('RouteHandler')
    .replaceWith(replaceRouteHandler);

  root.find(j.ObjectPattern)
    .replaceWith(removeRouteHandlerRequire);

  return root.toSource();
};
