const React = require('react');
const {Navigation} = require('react-router');

const OneComponent = React.createClass({
  mixins: [
    Navigation
  ],

  _functionOne() {
    const query = {key: 'value'};
    this.transitionTo('routeTwo', query);
    this.transitionTo(this.props.toRoute);
  },

  _functionTwo() {
    const query = {key: 'value'};
    this.replaceWith('routeThree', query);
  },

  render() {
    return (
      <div></div>
    );
  }
});
