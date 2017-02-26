const React = require('react');
const {History} = require('react-router');

const OneComponent = React.createClass({
  mixins: [
    History
  ],

  _functionOne() {
    const query = {key: 'value'};
    this.history.pushState(null, 'newPath/aa', query);
    this.history.pushState(null, this.props.toRoute);
  },

  _functionTwo() {
    const query = {key: 'value'};
    this.history.replaceState(null, 'newPath/bb', query);
  },

  render() {
    return (
      <div></div>
    );
  }
});
