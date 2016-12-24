const React = require('react');
const Router = require('react-router');
const State = Router.State;
const History = Router.History;

const TwoComponent = React.createClass({
  mixins: [
    History
  ],

  _functionOne() {
    this.history.goBack();
  },

  render() {
    return (
      <div onClick={this.history.pushState.bind(null, null, 'user')}>
        <div onClick={this.history.replaceState.bind(null, null, 'user')} />
      </div>
    );
  }
});
