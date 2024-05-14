import type { Component } from 'solid-js'
import { For } from 'solid-js/web'

import type { TDecision } from './model'
import { mustUseContext } from './model'

import './assets/fontawesome/css/all.min.css'

export const JumplistItem: Component<{decision: TDecision}> = (props) => {
  return (
    <a class="dropdown-item" href={`#decision${props.decision.id}`}>{props.decision.title}</a>
  )
};

export const Jumplist: Component = () => {
  const {state, setState} = mustUseContext();

  return (
    <div class="dropdown is-hoverable is-up is-right"
      style="position: fixed; bottom: 1rem; right: 1rem; z-index: calc(var(--bulma-modal-z)-1);">
      <div class="dropdown-trigger">
        <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
          <span>Jump to Decision</span>
          <span class="icon is-small">
            <i class="fa-solid fa-angle-up has-color-white" aria-hidden="true"></i>
          </span>
        </button>
      </div>
      <div class="dropdown-menu" role="menu">
        <div class="dropdown-content">
          <For each={state.d}>{(D) => (
            <JumplistItem decision={D}/>
          )}</For>
        </div>
      </div>
    </div>
  )
}
