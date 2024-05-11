import type { Component } from 'solid-js'
import { For, Show } from 'solid-js/web'

import type { TDecision } from './model'
import { mustUseContext } from './model'

export const JumplistItem: Component<{
  decision: TDecision,
}> = (props) => {
  return <li class="menu-list">
    <a href={`#decision${props.decision.id}`}>{props.decision.title}</a>
  </li>;
};

export const Jumplist: Component = () => {
  const {state, setState} = mustUseContext();

  return (
    <aside>
      <h4 class="title is-5">Jump list</h4>
      <Show when={state.d.length > 0} fallback={<p>No decisions yet.</p>}>
        <ul class="menu">
          <For each={state.d}>{(D: TDecision) => (
            <JumplistItem decision={D}/>
          )}</For>
        </ul>
      </Show>
    </aside>
  )
}
