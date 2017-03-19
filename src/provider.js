/* @flow */
import { Component, PropTypes, Children } from 'react';
import type { Element } from 'react';
import type { CombinedModules } from './types';

// https://facebook.github.io/react/docs/context.html
export default class Provider extends Component {
  props: {
    modules: CombinedModules,
    children: Element<*>,
  };

  modules: CombinedModules;

  constructor(props: Object, context: Object) {
    super(props, context);
    this.modules = props.modules;
  }

  getChildContext() {
    return {
      selectors: this.modules.selectors,
      actionCreators: this.modules.actionCreators,
    };
  }

  render() {
    return Children.only(this.props.children);
  }
}

Provider.childContextTypes = {
  selectors: PropTypes.object.isRequired,
  actionCreators: PropTypes.object.isRequired,
};

Provider.displayName = 'ModulesProvider';
