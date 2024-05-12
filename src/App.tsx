import type { Component } from 'solid-js';

import type { DecisionStore } from './model'
import { DContext, createLocalStore } from './model'
import { Decisions } from './Decisions'
import { Jumplist } from './Jumplist'


const App: Component = () => {
  const [state, setState] = createLocalStore<DecisionStore>({d: []})
  setState("d", () => true, { editingTitle: false })

  return (
    <DContext.Provider value={{state, setState}}>
      <div class="columns is-gapless">
        <div class="column is-one-fifth mr-6"
             style="border-right: 2px solid var(--bulma-grey-darker)">
          <Jumplist />
        </div>
        <main class="column">
          <Decisions />
        </main>
      </div>
    </DContext.Provider>
  );
};

/* TODO
 * ALL DONE FOR NOW
 *
 * Decision:
 * X Use solid-js/store for a single decision
 * X On each input field change, update store
 * X Buttons for adding rows/cols:
 *   X Will update relevant arrays in store
 *
 * ~~"Debug" button
 *   X For now, use the `show` to display a list of rank calculations!
 *   So it's actually usable!
 *
 * App:
 * X Use store for an array of decision (IDs?)
 * X "Add decision" will append to this array
 * X Possible need of sharing context for decisiosn between App and Decision
 * X Use the array of known decisions, and the context, to produce the jump list
 *
 * Edit option and factor names
 * Better cleaner interface
 *
 * */

export default App;
