const React = require('react');
const {Route, RouteHandler, DefaultRoute} = require('react-router');

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

const RouteHandlerComponentOne = React.createClass({
  render() {
    return <RouteHandler/>;
  }
});

const RouteHandlerComponentTwo = React.createClass({
  render() {
    return (<RouteHandler/>);
  }
});

const Router = require('react-router');
const RouteHandler = Router.RouteHandler;
const DefaultRoute = Router.DefaultRoute;
