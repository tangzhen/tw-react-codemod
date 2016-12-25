const React = require('react');
const {Route, RouteHandler} = require('react-router');

module.exports = (
  <Route name="about" handler={About}>
    <DefaultRoute name='defaultAbout' handler={DefaultAbout}/>
    <Route name="subRoute" path='aboutSubRout' handler={About}/>
  </Route>
);

const RouteHandlerComponent = React.createClass({
  render() {
    return (
      <div>
        <RouteHandler/>
      </div>
    );
  }
});
