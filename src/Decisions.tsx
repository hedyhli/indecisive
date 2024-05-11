import type { Component } from 'solid-js';

import { createSignal } from 'solid-js';
import { For, Show } from 'solid-js/web'

import type { TDecision } from './model'
import { mustUseContext } from './model'

export const Decisions: Component = () => {
  const {state, setState} = mustUseContext();

  const addDecision = () => {
    setState("d", (d: TDecision[]) => {
      const id = d.length === 0 ? 0 : d[d.length-1].id + 1
      return [
        ...d,
        {id, editingTitle: false, title: `Decision ${id}`, options: [], factors: []}
      ]
    })
  }

  return <div>
    <div class="block">
      <h3 class="title is-3">Decisions</h3>
    </div>
    <div class="block">
      <Show when={state.d.length > 0} fallback={<p>Hooray, no decisions to make!!!</p>}>
        <For each={state.d}>{(D) => (
          <Decision decision={D} />
        )}</For>
      </Show>
    </div>
    <br />
    <div class="block">
      <button class="button is-primary is-outlined" onclick={addDecision}>+ Add Decision</button>
    </div>
  </div>
}

const Title: Component<{decision: TDecision}> = (props) => {
  const {state, setState} = mustUseContext();
  const D = props.decision;

  const [newTitle, setNewTitle] = createSignal(D.title),
  startEditTitle = () => setState(
    "d",
    (decision: TDecision) => props.decision.id === decision.id,
    {editingTitle: true}
  ),
  editingTitle = (e: KeyboardEvent) => {
    if (e.key == 'Escape') {
      setNewTitle(D.title);
      return cancelEditTitle();
    }
    setNewTitle((e.currentTarget as HTMLInputElement).value);
    if (e.key == 'Enter') {
      editedTitle();
    }
  },
  editedTitle = () => setState(
    "d",
    (decision: TDecision) => props.decision.id === decision.id,
    {title: newTitle(), editingTitle: false}
  ),
  cancelEditTitle = () => setState(
    "d",
    (decision: TDecision) => props.decision.id === decision.id,
    {editingTitle: false}
  );

  return (
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <Show when={D.editingTitle} fallback={
            <h3 class="subtitle">{D.title}</h3>
          }>
            <input class="input" value={D.title} onkeydown={editingTitle}></input>
          </Show>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <Show when={D.editingTitle} fallback={
            <button onClick={startEditTitle} class="button is-small is-outlined is-info">edit</button>
          }>
            <button class="button is-primary" onclick={editedTitle}>Save</button>
            <button class="button is-danger is-text" onclick={cancelEditTitle}>Cancel</button>
          </Show>
        </div>
      </div>
    </div>
  )
}

const Decision: Component<{decision: TDecision}> = (props) => {
  const {state, setState} = mustUseContext();
  const D = props.decision

  const rmDecision = (id: number) => setState("d", (d: TDecision[]) => d.filter((decision) => decision.id !== id));


  // Below is a testing demonstration of using basic signals
  let input: HTMLInputElement

  // Storing a specific input field value
  const [value, setValue] = createSignal("Default name");
  // Signal for the element that will debug (show) the input value
  const [show, setShow] = createSignal("N/A");

  // Input value changed, store it
  const changed = () => {
    setValue(() => input.value);
  }
  // Debug button clicked, updated the showing element to reflect input value
  const showButton = () => {
    setShow(() => value())
  }

  // Actual decision table component I'll prolly use
  return <div class="card has-background-black-ter" id={`decision${D.id}`}>
    <div class="card-content">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <Title decision={props.decision} />
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <button onClick={() => rmDecision(D.id)} class="button is-small is-outlined is-danger">X</button>
          </div>
        </div>
      </div>
      <table class="table has-background-black-ter">
        <thead>
          <tr>
          <th></th>
            <th>
              <div class="level">
                <div class="level-left"><span class="level-item">Options</span></div>
                <div class="level-right">
                  <button class="button is-ghost is-info">+</button>
                </div>
              </div>
            </th>
            <th>
              <div class="level">
                <div class="level-left"><span class="level-item">Value 1</span></div>
                <div class="level-right">
                  <button class="button is-ghost is-link">+</button>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tfoot>
          <tr>
          <th></th>
            <th class="has-text-right">Weights</th>
            <th><input class="input" size="20" type="number"></input></th>
          </tr>
        </tfoot>
        <tbody>
          <tr>
            <td><button class="button is-small is-ghost is-danger">X</button></td>
            <td><input ref={input} value={value()} onChange={changed} class="input" size="20" type="text"></input></td>
            <td><input class="input" size="20" type="number"></input></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer">
      <span class="card-footer-item"><button class="button is-text" onClick={showButton}>Debug</button></span>
      <span class="card-footer-item"><p>{show()}</p></span>
    </div>
  </div>;
};
