import type { Component } from 'solid-js';

import { createSignal } from 'solid-js';
import { For, Show } from 'solid-js/web'

import type { TDecision, TOption } from './model'
import { mustUseContext } from './model'

export const Decisions: Component = () => {
  const {state, setState} = mustUseContext();

  const addDecision = () => {
    setState("d", state.d.length, () => {
      const id = state.d.length === 0 ? 0 : state.d[state.d.length-1].id + 1
      return {
        id,
        editingTitle: false,
        title: `Decision ${id}`,
        options: [{ name: "SolidJS", values: [50] }],
        factors: [{ name: "Hype", weight: 100 }],
      }
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

const FactorName: Component<{decision: TDecision, i: number}> = (props) => {
  const {state, setState} = mustUseContext();
  const rmFactor = () => {
    let factors = [...props.decision.factors]
    if (factors.length == 1) {
      return
    }
    // Delete factor
    factors.splice(props.i, 1)
    setState("d", (dec) => dec.id == props.decision.id, {
      factors: factors,
      options: props.decision.options.map((opt: TOption) => {
        // Delete value for each option
        let values = [...opt.values]
        values.splice(props.i, 1)
        return { ...opt, values }
      }
    )})
  }
  return (
    <div class="level">
      <div class="level-left">
        <span class="level-item">{props.decision.factors[props.i].name}</span>
        <span class="level-item"><button class="button is-small has-text-danger is-ghost" onClick={rmFactor}>X</button></span>
      </div>
    </div>
  )
}

const TblHead: Component<{decision: TDecision}> = (props) => {
  const {state, setState} = mustUseContext();
  const D = props.decision;

  const addFactor = () => {
    setState("d", (dec) => dec.id == D.id, {
      factors: [...D.factors, {name: `Factor ${D.factors.length+1}`, weight: 100}],
      options: D.options.map((opt) => ({
        ...opt, values: [...opt.values, 50]
      }))
    })
  }

  return (
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
      <For each={D.factors}>{(F, i) => (
        <th>
          <Show when={D.factors.length-1 == i()} fallback={
            <FactorName decision={D} i={i()} />
          }>
            <div class="level">
              <div class="level-left"><span class="level-item">
                <FactorName decision={D} i={i()} />
              </span></div>
              <div class="level-right">
                <button class="button is-ghost is-link" onClick={addFactor}>+</button>
              </div>
            </div>
          </Show>
        </th>
      )}</For>
    </tr>
  );
}

const TblFoot: Component<{decision: TDecision}> = (props) => {
  const D = props.decision;
  return (
    <tr>
      <th></th>
      <th class="has-text-right">Weights</th>
      <For each={D.factors}>{(F) => (
        <th><input class="input" size="20" type="number" value={F.weight}></input></th>
      )}</For>
    </tr>
  );
}

const Table: Component<{decision: TDecision}> = (props) => {
  const D = props.decision;
  return (
    <table class="table has-background-black-ter">
      <thead><TblHead decision={props.decision} /></thead>
      <tfoot><TblFoot decision={props.decision} /></tfoot>
      <tbody>
        <For each={D.options}>{(O) => (
          <tr>
            <td><button class="button is-small is-ghost is-danger">X</button></td>
            <td><input class="input" size="20" type="text" value={O.name}></input></td>
            <For each={O.values}>{(v) => (
              <td><input class="input" size="20" type="number" value={v}></input></td>
            )}</For>
          </tr>
        )}</For>
      </tbody>
    </table>
  )
}

const Decision: Component<{decision: TDecision}> = (props) => {
  const {state, setState} = mustUseContext();
  const D = props.decision

  const rmDecision = (id: number) => setState("d", (d: TDecision[]) => d.filter((decision) => decision.id !== id));

  // Actual decision table component I'll prolly use
  return <div class="card has-background-black-ter" id={`decision${D.id}`}>
    <div class="card-content">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <Title decision={D} />
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <button onClick={() => rmDecision(D.id)} class="button is-small is-outlined is-danger">X</button>
          </div>
        </div>
      </div>
      <Table decision={D} />
    </div>
    <div class="card-footer">
      <span class="card-footer-item"><button class="button is-text">Debug</button></span>
      <span class="card-footer-item"><p>Todo</p></span>
    </div>
  </div>
};
