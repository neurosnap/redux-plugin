/* @flow */
import { spawn } from 'redux-saga';

import type { CombinedModules } from './types';

const prepSagas = (sagas, modules) => Object
  .values(sagas)
  .map((saga) => spawn(saga, modules));

export default function* (modules: CombinedModules): Generator<*, *, *> {
  const { sagas, ...others } = modules;
  yield prepSagas(sagas, others);
}
