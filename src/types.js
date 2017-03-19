/* @flow */
export type Functors = {
  [key: string]: Function,
};

export type Gentors = {
  [key: string]: Generator<*, *, *>,
};

export type Reducer = Function;
export type ActionType = string;
export type ActionTypes = {
  [key: string]: ActionType,
};

export type Module = {
  reducers?: Functors,
  selectors?: Functors,
  actionTypes?: ActionTypes,
  actionCreators?: Functors,
  components?: Functors,
  sagas?: Gentors,
  effects?: Gentors,
};

export type CombinedModules = Module;
export type Modules = Array<Module>;
