import type { Component } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';
import { For, Show } from 'solid-js/web'

import { Decision, JumpListItem } from './components/Decision'
import type { TDecision } from './components/Decision'


type DecisionStore = {
	d: TDecision[];
}

const LOCAL_STORAGE_KEY = "todos-solid";
function createLocalStore<T extends object>(value: T) {
  // load store on init
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  const [state, setState] = createStore<T>(stored ? JSON.parse(stored) : value);

  // JSON.stringify creates deps on every iterable field
  createEffect(() => localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state)));
  return [state, setState] as const;
}

const App: Component = () => {
	const [state, setState] = createLocalStore<DecisionStore>({d: []})

	const addDecision = () => {
		setState("d", (d) => [
			...d,
			{id: d.length, title: `Decision ${d.length}`, options: [], factors: []}
		])
	}

	const rmDecision = (id: number) => setState("d", (d) => d.filter((D) => D.id !== id))

	return (
		<div class="columns is-gapless">
			<aside class="column is-one-fifth mr-6" style="border-right: 2px solid var(--bulma-grey-darker)">
				<h4 class="title is-5">Jump list</h4>
				<Show when={state.d.length > 0} fallback={<p>No decisions yet.</p>}>
					<ul class="menu">
						<For each={state.d}>{(D) => (
							<JumpListItem decision={D}/>
						)}</For>
					</ul>
				</Show>
			</aside>
			<main class="column">
				<h3 class="title is-3">Decisions</h3>
				<div class="block">
					<For each={state.d}>{(D) => (
						<Decision decision={D} remover={() => rmDecision(D.id)} />
					)}</For>
				</div>
				<button class="block button is-primary is-outlined" onclick={addDecision}>+ Add Decision</button>
			</main>
		</div>
	);
};

/* TODO
 *
 * Decision:
 * Use solid-js/store for a single decision
 * On each input field change, update store
 * Buttons for adding rows/cols:
 *   Will update relevant arrays in store
 *
 * "Debug" button
 *   For now, use the `show` to display a list of rank calculations!
 *   So it's actually usable!
 *
 * App:
 * Use store for an array of decision (IDs?)
 * "Add decision" will append to this array
 * Possible need of sharing context for decisiosn between App and Decision
 * Use the array of known decisions, and the context, to produce the jump list
 *
 * */

export default App;
