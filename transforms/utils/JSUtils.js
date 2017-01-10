const renameIdentifier = (path, newName) => {
  path.get('name').replace(newName);

  return path.node;
};

module.exports = {
  renameIdentifier
};
