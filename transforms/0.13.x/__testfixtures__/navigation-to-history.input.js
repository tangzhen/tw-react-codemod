const React = require('react');
const {Navigation} = require('react-router');

const OneComponent = React.createClass({
  mixins: [
    Navigation
  ],

  _functionOne() {
    const query = {key: 'value'};
    this.transitionTo('/users', query);
  },

  _functionTwo() {
    const query = {key: 'value'};
    this.replaceWith('user', query);
  },

  render() {
    return (
      <div></div>
    );
  }
});
