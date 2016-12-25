const React = require('react');
const {
  Route
} = require('react-router');

module.exports = (
  <Route component={About}>
    <IndexRoute component={DefaultAbout} />
    <Route path='aboutSubRout' component={About} />
  </Route>
);

const RouteHandlerComponent = React.createClass({
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
});
