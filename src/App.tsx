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
        <Decisions />
        <Show when={state.d.length > 1}>
          <Jumplist />
        </Show>
      </main>
    </DContext.Provider>
  );
};

/* TODO
 *
 * !1
 * Same heights, more breathing space like option row
 * (both height & padding of spans when focused)
 * Boldify top options (with ties)
 *
 * !2
 * Left columns' right borders
 * Export as CSV, JSON
 *
 * !3
 * Rearrange factors
 *   options
 *   decisions
 * Show percentile in () rather than value
 * Export to spreadsheet formats (see Lume plugin?)
 *
 * !4
 * Rank bg colors
 * Resizable columns? lol
 *
 * */

export default App;
