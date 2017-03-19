/* @flow */
import { enhanceReducers } from './reducer';
import type { Modules, CombinedModules, Functors, Gentors } from './types';

export function use(modules: Modules): CombinedModules {
  const reducers = combine(modules, 'reducers');
  const actionTypes = combine(modules, 'actionTypes');
  const actionCreators = combine(modules, 'actionCreators');
  const sagas = combine(modules, 'sagas');
  const selectors = combine(modules, 'selectors');

  const enhancedReducers = enhanceReducers(reducers, actionTypes);

  return {
    reducers: enhancedReducers,
    actionTypes,
    actionCreators,
    sagas,
    selectors,
  };
}

export function combine(modules: Modules, name: string) {
  const merged = {};

  modules.forEach((module) => {
    if (!module.hasOwnProperty(name)) {
      return;
    }

    Object
      .keys(module[name])
      .forEach((key) => {
        if (merged.hasOwnProperty(key)) {
          console.error(`${name} ${key} already exists`);
          return;
        }

        merged[key] = module[name][key];
      });
  });

  if (name === 'sagas' || name === 'reducers') return merged;

  const errorAlreadySent = {};
  return new Proxy(merged, {
    get: (target, prop) => {
      if (prop === '@@toStringTag') {
        return target[prop];
      }

      if (!target.hasOwnProperty(prop) && !errorAlreadySent.hasOwnProperty(prop)) {
        console.error(`Attempting to access non-existent property [${prop}] from [${name}]`);
        errorAlreadySent[prop] = true;
        return undefined;
      }

      return target[prop];
    },
  });
}
