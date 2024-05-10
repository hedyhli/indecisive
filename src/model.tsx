import type { Context } from 'solid-js';
import type { SetStoreFunction } from 'solid-js/store';
import { createContext, createEffect } from 'solid-js'
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

type NotUndefined<T> = Exclude<T, undefined>;

type storeTuple = [DecisionStore, SetStoreFunction<DecisionStore>];
export const DContext: Context<NotUndefined<storeTuple>> = createContext<storeTuple>()

const LOCAL_STORAGE_KEY = "indecisive-solid";
export function createLocalStore<T extends object>(value: T) {
  // load store on init
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  const [state, setState] = createStore<T>(stored ? JSON.parse(stored) : value);

  // JSON.stringify creates deps on every iterable field
  createEffect(() => localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state)));
  return [state, setState] as const;
}
