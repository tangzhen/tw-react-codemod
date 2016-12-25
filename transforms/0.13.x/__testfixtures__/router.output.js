const React = require('react');
const {Route} = require('react-router');

module.exports = (
  <Route component={About}>
    <Route path='aboutSubRout' component={About} />
  </Route>
);
