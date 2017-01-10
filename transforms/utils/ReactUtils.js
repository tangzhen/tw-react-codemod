const _ = require('lodash');

const removeJSXElementAttribute = (path, attributeName) => {
  _.remove(path.node.openingElement.attributes, {name: {name: attributeName}});
};

const renameJSXElementAttribute = (path, oldName, newName) => {
  /*
  This is NodePath api, and we think use lodash change data is easier.
  path.get('openingElement', 'attributes')
    .filter(attribute => {
      return attribute.get('name', 'name').node.name === oldName;
    })
    .map(attribute => {
      return attribute.get('name', 'name');
    })
    .forEach(name => {
      name.replace(newName);
    });
  */

  _.chain(path.node)
    .get('openingElement.attributes')
    .filter({
      name: {name: oldName}
    })
    .forEach(attribute => {
      _.set(attribute, 'name.name', newName);
    })
    .value();
};

const renameJSXElement = (path, elementName) => {
  _.set(path.node, 'openingElement.name', elementName)
};

module.exports = {
  removeJSXElementAttribute,
  renameJSXElementAttribute,
  renameJSXElement
};
