const React = require('react');
const Router = require('react-router');
const State = Router.State;
const Navigation = Router.Navigation;

const TwoComponent = React.createClass({
  mixins: [
    Navigation
  ],

  _functionOne() {
    this.goBack();
  },

  render() {
    return (
      <div></div>
    );
  }
});
