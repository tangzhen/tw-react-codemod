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
      <div onClick={this.transitionTo.bind(null, 'user')}>
        <div onClick={this.replaceWith.bind(null, 'user')} />
      </div>
    );
  }
});
