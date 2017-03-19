/* @flow */
import type { Functors, ActionTypes, Reducer } from './types';

export function enhanceReducers(reducers: Functors, actionTypes: ActionTypes) {
  const enhanced = {};
  Object
    .keys(reducers)
    .forEach((key) => {
      enhanced[key] = reducerEnhancer(reducers[key], actionTypes);
    });
  return enhanced;
}

export function reducerEnhancer(reducer: Reducer, actionTypes: ActionTypes) {
  return (state: Object, action: Object) => reducer(state, action, actionTypes);
}
