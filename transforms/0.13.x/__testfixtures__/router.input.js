const React = require('react');
const {Route} = require('react-router');

module.exports = (
  <Route name="about" handler={About}>
    <Route name="subRoute" path='aboutSubRout' handler={About}/>
  </Route>
);
