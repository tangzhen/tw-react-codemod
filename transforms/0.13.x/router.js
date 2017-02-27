'use strict';
const {removeJSXElementAttribute, renameJSXElementAttribute} = require('../utils/ReactUtils');
const {renameIdentifier} = require('../utils/JSUtils');

module.exports = (file, api, options) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  const template = j.template;

  const removeNameAttribute = p => {
    removeJSXElementAttribute(p, 'name');

    return p.node;
  };

  const renameHandlerToComponent = p => {
    renameJSXElementAttribute(p, 'handler', 'component');

    return p.node;
  };

  const findRequireReactRouter = root.find('CallExpression', {
      callee: {name: 'require'},
      arguments: [{value: 'react-router'}]
    }).size() > 0;

  if (findRequireReactRouter) {
    // Remove `const RouteHandler = Router.RouteHandler;` declaration
    root.find('VariableDeclaration', {
      declarations: [{
        id: {
          name: 'RouteHandler'
        }
      }]
    }).remove();

    // Remove `const {RouteHandler} = require('react-router');` declaration
    root.find('Property', {
      key: {
        name: 'RouteHandler'
      }
    }).remove();

    // Replace RouteHandler with this.props.children
    root.findJSXElements('RouteHandler')
      .replaceWith((p) => {
        if (p.parent.node.type === 'JSXElement') {
          return j.jsxExpressionContainer(template.expression`this.props.children`);
        } else {
          return template.expression`this.props.children`;
        }
      });

    // Change `<Route name='' handler={} />` to `<Route component={} />`
    root.findJSXElements('Route')
      .forEach(removeNameAttribute)
      .forEach(renameHandlerToComponent);

    // Rename all 'DefaultRoute' to 'IndexRoute'
    root.find(j.Identifier, {name: 'DefaultRoute'})
      .forEach(p => {
        renameIdentifier(p, 'IndexRoute');
      });

    // Change `<IndexRoute name='' handler={} />` to `<IndexRoute component={} />`
    root.findJSXElements('IndexRoute')
      .forEach(removeNameAttribute)
      .forEach(renameHandlerToComponent);
  }

  return root.toSource();
};
