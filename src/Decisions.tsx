import type { Component } from 'solid-js';

import { createSignal, createMemo } from 'solid-js';
import { For, Show } from 'solid-js/web'

import type { TDecision, TOption } from './model'
import { mustUseContext } from './model'

import './assets/fontawesome/css/all.min.css'

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
        <For each={state.d}>{(D, i) => (
          <Decision decision={D} i={i()} />
        )}</For>
      </Show>
    </div>
    <br />
    <div class="block">
      <button class="button is-primary is-outlined" onclick={addDecision}>
        <span class="icon-text">
          <span class="icon"><i class="fa-solid fa-plus"></i></span>
          <span>Add Decision</span>
        </span>
      </button>
    </div>
  </div>
}

const Title: Component<{decision: TDecision, i: number}> = (props) => {
  const {state, setState} = mustUseContext();
  const D = props.decision;

  const [newTitle, setNewTitle] = createSignal(D.title),
  startEditTitle = () => setState("d", props.i, {editingTitle: true}),
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
  editedTitle = () => setState("d", props.i, {title: newTitle(), editingTitle: false}),
  cancelEditTitle = () => setState("d", props.i, {editingTitle: false});

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
            <button onClick={startEditTitle} class="button is-small is-outlined is-primary">
              <span class="icon"><i class="fa-solid fa-pencil"></i></span>
            </button>
          }>
            <button class="button is-primary is-small" onclick={editedTitle}>
              <span class="icon"><i class="fa-solid fa-check"></i></span>
            </button>
            <button class="button is-danger is-text" onclick={cancelEditTitle}>Cancel</button>
          </Show>
        </div>
      </div>
    </div>
  )
}

const FactorName: Component<{decision: TDecision, f: number}> = (props) => {
  const {state, setState} = mustUseContext();
  const rmFactor = () => {
    let factors = [...props.decision.factors]
    if (factors.length == 1) {
      return
    }
    // Delete factor
    factors.splice(props.f, 1)
    setState("d", props.f, {
      factors: factors,
      options: props.decision.options.map((opt: TOption) => {
        // Delete value for each option
        let values = [...opt.values]
        values.splice(props.f, 1)
        return { ...opt, values }
      }
    )})
  }
  return <>
    <div class="level-item">{props.decision.factors[props.f].name}</div>
    <Show when={props.decision.gearing}>
      <div class="level-item">
        <button class="button is-small has-text-danger is-ghost" onClick={rmFactor}>
          <span class="icon"><i class="fa-solid fa-x" aria-hidden="true"></i></span>
        </button>
      </div>
    </Show>
  </>
}

const TblHead: Component<{decision: TDecision, i: number}> = (props) => {
  const {state, setState} = mustUseContext();
  const D = props.decision;

  const addFactor = () => {
    setState("d", props.i, {
      factors: [...D.factors, {name: `Factor ${D.factors.length+1}`, weight: 100}],
      options: D.options.map((opt) => ({
        ...opt, values: [...opt.values, 50]
      }))
    })
  }

  const addOption = () => setState(
    "d", props.i, "options", D.options.length,
    { name: "Another Option", values: [ ...D.options[0].values ] }
  )

  return (
    <tr>
      <Show when={D.gearing}>
        <th></th>
      </Show>
      <th>
        <div class="level">
          <div class="level-left"><span class="level-item">Options</span></div>
          <div class="level-right">
            <button class="button is-ghost is-info" onClick={addOption}>
              <span class="icon"><i class="fa-solid fa-plus"></i></span>
            </button>
          </div>
        </div>
      </th>
      <For each={D.factors}>{(_, f) => (
        <th>
          <div class="level">
            <div class="level-left">
              <FactorName decision={D} f={f()} />
            </div>
              <div class="level-right">
                <div class="level-item">
                <Show when={D.factors.length-1 == f()} fallback={
                  <button class="button is-ghost">
                    <span class="icon"></span>
                  </button>
                }>
                  <button class="button is-ghost is-link" onClick={addFactor}>
                    <span class="icon"><i class="fa-solid fa-plus"></i></span>
                  </button>
                </Show>
                </div>
              </div>
          </div>
        </th>
      )}</For>
    </tr>
  );
}

const TblFoot: Component<{decision: TDecision, i: number}> = (props) => {
  const {state, setState} = mustUseContext();
  const changedWeight = (w: number, e: Event) => setState(
    "d", props.i, "factors", w, "weight",
    parseFloat((e.target as HTMLInputElement).value.trim())
  )
  return (
    <tr>
      <Show when={props.decision.gearing}>
        <th></th>
      </Show>
      <th class="has-text-right">Weights</th>
      <For each={props.decision.factors}>{(F, i) => (
        <th><input class="input" size="20" type="number" value={F.weight} onChange={[changedWeight, i()]}></input></th>
      )}</For>
    </tr>
  );
}

const Table: Component<{decision: TDecision, i: number}> = (props) => {
  const {state, setState} = mustUseContext();
  const D = props.decision;

  const rmOption = (o: number) => {
    let options = [...D.options]
    options.splice(o, 1)
    setState("d", props.i, "options", options)
  }
  const changedOption = (o: number, e: Event) => {
    setState("d", props.i, "options", o, { name: (e.target as HTMLInputElement).value })
  }
  const changedValue = ({ o, v }: {o: number, v: number}, e: Event) => {
    setState(
      "d", props.i, "options", o, "values", v,
      parseFloat((e.target as HTMLInputElement).value.trim())
    )
  }

  return (
    <table class="table has-background-black-ter">
      <thead><TblHead decision={props.decision} i={props.i} /></thead>
      <tfoot><TblFoot decision={props.decision} i={props.i} /></tfoot>
      <tbody>
        <For each={D.options}>{(O, i) => (
          <tr>
            <Show when={props.decision.gearing}>
              <td>
                <button class="button is-small is-text has-text-danger"
                  style="text-decoration: none" onClick={[rmOption, i()]}>
                  <span class="icon"><i class="fa-solid fa-x" aria-hidden="true"></i></span>
                </button>
              </td>
            </Show>
            <td><input class="input" size="20" type="text" value={O.name} onChange={[changedOption, i()]}></input></td>
            <For each={O.values}>{(val, v) => (
              <td><input class="input" size="20" type="number" value={val} onChange={[changedValue, {o: i(), v: v()}]}></input></td>
            )}</For>
          </tr>
        )}</For>
      </tbody>
    </table>
  )
}

const Decision: Component<{decision: TDecision, i: number}> = (props) => {
  const {state, setState} = mustUseContext();
  const D = props.decision

  const rmDecision = (id: number) => setState("d", (d: TDecision[]) => d.filter((decision) => decision.id !== id));
  const getRank = createMemo(() => {
    const decision = state.d[props.i]
    let evals = decision.options.map((opt) => [
      opt.values.reduce((prev, val, v) => prev + val * decision.factors[v].weight, 0),
      opt.name
    ])
    evals = evals.sort((e1, e2) => e2[0] - e1[0])
    console.log(evals)
    return evals.map((ev) => `${ev[1]} (${ev[0]})`).join(", ")
  })
  const toggleGear = () => setState("d", props.i, { gearing: !state.d[props.i].gearing })

  // Actual decision table component I'll prolly use
  return <div class="card has-background-black-ter" id={`decision${D.id}`}>
    <div class="card-content">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <Title decision={D} i={props.i} />
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <button class="button is-medium is-text" style="text-decoration: none;"
              onClick={toggleGear}>
              <span class="icon"><i class="fa-solid fa-gear" aria-hidden="true"></i></span>
            </button>
          </div>
          <div class="level-item">
            <button onClick={() => rmDecision(D.id)} class="button is-small is-outlined is-danger">
              <span class="icon"><i class="fa-solid fa-x" aria-hidden="true"></i></span>
            </button>
          </div>
        </div>
      </div>
      <Table decision={D} i={props.i} />
    </div>
    <div class="card-footer">
      <span class="card-footer-item"><p>{getRank()}</p></span>
    </div>
  </div>
};
