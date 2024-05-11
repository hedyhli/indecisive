import type { SetStoreFunction } from 'solid-js/store';
import { createContext, createEffect, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'


export type TOption = {
  name: string;
  values: number[]
}

export type TFactor = {
  name: string;
  weight: number;
}

export type TDecision = {
  id: number;
  title: string;
  options: TOption[];
  factors: TFactor[];
}

export type DecisionStore = {
  d: TDecision[];
}

type storeTuple = {state: DecisionStore, setState: SetStoreFunction<DecisionStore>};
export const DContext = createContext<storeTuple>()!;
export const mustUseContext = () => {
  const ctx = useContext(DContext);
  if (!ctx) {
    throw new Error("DContext should be provided!");
  }
  return ctx as storeTuple
}

const LOCAL_STORAGE_KEY = "indecisive-solid";
export function createLocalStore<T extends object>(value: T) {
  // load store on init
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  const [state, setState] = createStore<T>(stored ? JSON.parse(stored) : value);

  // JSON.stringify creates deps on every iterable field
  createEffect(() => localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state)));
  return [state, setState] as const;
}
