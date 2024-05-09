import type { Component } from 'solid-js';

import { Decision } from './components/Decision'

import './bulma.css'

const App: Component = () => {
	return (
		<div class="columns is-gapless">
			<aside class="column is-one-fifth mr-6" style="border-right: 2px solid var(--bulma-grey-darker)">
				<h4 class="title is-5">Jump list</h4>
				<p>No decisions yet.</p>
			</aside>
			<main class="column">
				<h3 class="title is-3">Decisions</h3>
				<div class="block">
					<Decision />
				</div>
				<button class="block button is-primary is-outlined">+ Add Decision</button>
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
