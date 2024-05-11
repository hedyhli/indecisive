import type { Component } from 'solid-js';

import type { DecisionStore } from './model'
import { DContext, createLocalStore } from './model'
import { Decisions } from './Decisions'
import { Jumplist } from './Jumplist'


const App: Component = () => {
  const [state, setState] = createLocalStore<DecisionStore>({d: []})

  return (
    <div class="columns is-gapless">
      <div class="column is-one-fifth mr-6" style="border-right: 2px solid var(--bulma-grey-darker)">
        <DContext.Provider value={{state, setState}}>
          <Jumplist />
        </DContext.Provider>
      </div>
      <main class="column">
        <DContext.Provider value={{state, setState}}>
          <Decisions />
        </DContext.Provider>
      </main>
    </div>
  );
};

/* TODO
 *
 * Decision:
 * X Use solid-js/store for a single decision
 * On each input field change, update store
 * Buttons for adding rows/cols:
 *   Will update relevant arrays in store
 *
 * "Debug" button
 *   For now, use the `show` to display a list of rank calculations!
 *   So it's actually usable!
 *
 * App:
 * X Use store for an array of decision (IDs?)
 * X "Add decision" will append to this array
 * X Possible need of sharing context for decisiosn between App and Decision
 * X Use the array of known decisions, and the context, to produce the jump list
 *
 * */

export default App;
