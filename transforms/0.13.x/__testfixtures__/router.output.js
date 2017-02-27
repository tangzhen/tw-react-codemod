const React = require('react');
const {
  Route,
  IndexRoute
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

const RouteHandlerComponentOne = React.createClass({
  render() {
    return this.props.children;
  }
});

const RouteHandlerComponentTwo = React.createClass({
  render() {
    return (this.props.children);
  }
});

const Router = require('react-router');
const IndexRoute = Router.IndexRoute;
