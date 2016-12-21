const React = require('react');
const {History} = require('react-router');

const OneComponent = React.createClass({
  mixins: [
    History
  ],

  _functionOne() {
    const query = {key: 'value'};
    this.history.pushState(null, '/users', query);
  },

  _functionTwo() {
    const query = {key: 'value'};
    this.history.replaceState(null, 'user', query);
  },

  render() {
    return (
      <div></div>
    );
  }
});
