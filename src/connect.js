/* @flow */
import { connect as reduxConnect } from 'react-redux';
import { PropTypes } from 'react';
import { compose, getContext } from 'recompose';

// https://github.com/reactjs/react-redux/issues/599
export default (...args: any) => compose(
  getContext({ selectors: PropTypes.object, actionCreators: PropTypes.object }),
  reduxConnect(...args),
);
