import type { Component } from 'solid-js';
import { Show } from 'solid-js/web';

import type { DecisionStore } from './model'
import { DContext, createLocalStore } from './model'
import { Decisions } from './Decisions'
import { Jumplist } from './Jumplist'


const App: Component = () => {
  const [state, setState] = createLocalStore<DecisionStore>({d: []})
  setState("d", () => true, { editingTitle: false, gearing: false })

  return (
    <DContext.Provider value={{state, setState}}>
      <main>
        <Show when={state.d.length > 1}>
          <Jumplist />
        </Show>
        <Decisions />
      </main>
    </DContext.Provider>
  );
};

/* TODO
 *
 * When gearing:
 *   Make option names and factor names into inputs, onChange updates
 * Gear button feedback for whether current state is gearing or not
 *
 * */

export default App;
