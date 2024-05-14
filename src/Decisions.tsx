import type { Component } from 'solid-js';

import { createSignal, createMemo } from 'solid-js';
import { For, Show, Switch, Match } from 'solid-js/web'

import type { TDecision, TOption } from './model'
import { mustUseContext } from './model'
import { Confirm, useConfirmModal } from './widgets'

import './assets/fontawesome/css/all.min.css'

export const Decisions: Component = () => {
  const {state, setState} = mustUseContext();

  const addDecision = () => {
    // Insert at the top
    setState("d", () => {
      // Opt to use gaps in id in existing decisions, fallback to length
      const unused_ids: boolean[] = Array(state.d.length+1).fill(true);
      for (var i = 0; i < state.d.length; i++) {
        unused_ids[state.d[i].id] = false;
      }
      return [
        {
          id: unused_ids.findIndex((v) => v), // Should not be -1
          editingTitle: false,
          title: `What needs to be decided?`,
          options: [{ name: "SolidJS", values: [50] }],
          factors: [{ name: "Hype", weight: 100 }],
        }, ...state.d
      ]
    })
  }

  return <>
    <div class="block">
      <div class="level is-mobile">
        <div class="level-left">
          <div class="level-item"><h3 class="title is-3">Decisions</h3></div>
        </div>
        <div class="level-left">
          <div class="level-item">
            <button class="button is-primary is-outlined" onclick={addDecision}>
              <span class="is-hidden-mobile">
                <span class="icon-text">
                  <span class="icon"><i class="fa-solid fa-plus"></i></span>
                  <span>Add Decision</span>
                </span>
              </span>
              <span class="is-hidden-tablet">
                <span class="icon is-hidden-tablet"><i class="fa-solid fa-plus"></i></span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="block">
      <Show when={state.d.length > 0} fallback={<p>Hooray, no decisions to make!!!</p>}>
        <For each={state.d}>{(D, i) => (
          <Decision decision={D} i={i()} />
        )}</For>
      </Show>
    </div>
  </>
}

const Title: Component<{decision: TDecision, i: number}> = (props) => {
  const {state, setState} = mustUseContext();

  const [newTitle, setNewTitle] = createSignal(props.decision.title),
  startEditTitle = () => setState("d", props.i, {editingTitle: true}),
  editingTitle = (e: KeyboardEvent) => {
    if (e.key == 'Escape') {
      setNewTitle(props.decision.title);
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
    <div class="level is-mobile">
      <div class="level-left has-text-left">
        <div class="level-item">
          <Show when={props.decision.editingTitle} fallback={
            <h3 class="subtitle">{props.decision.title}</h3>
          }>
            <input class="input" value={props.decision.title} onkeydown={editingTitle}></input>
          </Show>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <Show when={props.decision.editingTitle} fallback={
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

const FactorName: Component<{decision: TDecision, i: number, f: number}> = (props) => {
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

  const addFactor = () => {
    setState("d", props.i, {
      factors: [...props.decision.factors, {name: `Factor ${props.decision.factors.length+1}`, weight: 100}],
      options: props.decision.options.map((opt) => ({
        ...opt, values: [...opt.values, 50]
      }))
    })
  }

  return (
    <div class="level is-mobile">
      <div class="level-left">
        <div class="level-item">{props.decision.factors[props.f].name}</div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <Switch>
            <Match when={props.decision.gearing}>
              <button class="button has-text-danger is-ghost" onClick={rmFactor}
                style="text-decoration: none">
                <span class="icon"><i class="fa-solid fa-trash" aria-hidden="true"></i></span>
              </button>
            </Match>
            <Match when={!props.decision.gearing && props.decision.factors.length-1 == props.f}>
              <button class="button is-ghost is-link" onClick={addFactor}>
                <span class="icon"><i class="fa-solid fa-plus"></i></span>
              </button>
            </Match>
            <Match when={!props.decision.gearing}>
              <button class="button is-ghost">
                <span class="icon"></span>
              </button>
            </Match>
          </Switch>
        </div>
      </div>
    </div>
  )
}

const TblHead: Component<{decision: TDecision, i: number}> = (props) => {
  const {state, setState} = mustUseContext();

  const addOption = () => setState(
    "d", props.i, "options", props.decision.options.length,
    { name: "Another Option", values: [ ...props.decision.options[0].values ] }
  )

  return (
    <tr>
      <Show when={props.decision.gearing}>
        <th></th>
      </Show>
      <th>
        <div class="level is-mobile">
          <div class="level-left"><span class="level-item">Options</span></div>
            <div class="level-right">
            <Show when={!props.decision.gearing} fallback={
              <button class="button is-ghost">
                <span class="icon"></span>
              </button>
            }>
              <button class="button is-ghost is-info" onClick={addOption}>
                <span class="icon"><i class="fa-solid fa-plus"></i></span>
              </button>
            </Show>
            </div>
        </div>
      </th>
      <For each={props.decision.factors}>{(_, f) => (
        <th>
          <FactorName decision={props.decision} i={props.i} f={f()} />
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
        <th>
          <Show when={!props.decision.gearing}
                fallback=<span style="font-weight:normal;">{F.weight}</span>
          >
            <input class="input is-static" type="number" value={F.weight}
              onChange={[changedWeight, i()]}></input>
          </Show>
        </th>
      )}</For>
    </tr>
  );
}

const Table: Component<{decision: TDecision, i: number}> = (props) => {
  const {state, setState} = mustUseContext();

  const rmOption = (o: number) => {
    let options = [...props.decision.options]
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

  return (<div class="table-container">
    <table class="table is-fullwidth has-background-black-ter">
      <thead><TblHead decision={props.decision} i={props.i} /></thead>
      <tfoot><TblFoot decision={props.decision} i={props.i} /></tfoot>
      <tbody>
        <For each={props.decision.options}>{(O, i) => (
          <tr>
            <Show when={props.decision.gearing}>
              <td>
                <button class="button is-text has-text-danger"
                  style="text-decoration: none" onClick={[rmOption, i()]}>
                  <span class="icon"><i class="fa-solid fa-trash" aria-hidden="true"></i></span>
                </button>
              </td>
            </Show>
            <td>
              <Show when={props.decision.gearing} fallback={O.name}>
                <input class="input" type="text" value={O.name}
                  onChange={[changedOption, i()]}></input>
              </Show>
            </td>
            <For each={O.values}>{(val, v) => (
              <td>
                <Show when={!props.decision.gearing} fallback={val}>
                  <input class="input is-static" type="number" value={val}
                    onChange={[changedValue, {o: i(), v: v()}]}></input>
                </Show>
              </td>
            )}</For>
          </tr>
        )}</For>
      </tbody>
    </table>
  </div>)
}

const Decision: Component<{decision: TDecision, i: number}> = (props) => {
  const {state, setState} = mustUseContext();

  let modal!: HTMLDivElement
  const [openModal, closeModal] = useConfirmModal(() => modal);
  const rmDecision = () => setState(
    "d", (d: TDecision[]) => d.filter((decision) => decision.id !== props.decision.id)
  );

  const getRank = createMemo(() => {
    const decision = state.d[props.i]
    let evals: [number, string][] = decision.options.map((opt) => [
      opt.values.reduce((prev, val, v) => prev + val * decision.factors[v].weight, 0),
      opt.name
    ])
    evals = evals.sort((e1, e2) => e2[0] - e1[0])
    return evals.map((ev) => `${ev[1]} (${ev[0]})`).join(", ")
  })
  const toggleGear = () => setState("d", props.i, { gearing: !state.d[props.i].gearing })

  // Actual decision table component I'll prolly use
  return <div class="card has-background-black-ter" id={`decision${props.decision.id}`}>
    <div class="card-content">
      <div class="level is-hidden-mobile">
        <div class="level-left">
          <div class="level-item">
            <Title decision={props.decision} i={props.i} />
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
            <button onclick={openModal}
              class="button is-medium is-ghost has-text-danger" style="text-decoration: none">
              <span class="icon"><i class="fa-solid fa-trash" aria-hidden="true"></i></span>
            </button>
          </div>
        </div>
      </div>
      <div class="block is-hidden-tablet">
        <Title decision={props.decision} i={props.i} />
      </div>
      <Table decision={props.decision} i={props.i} />
      <div class="block is-hidden-tablet">
        <div class="level is-mobile is-justify-content-flex-end">
          <button class="button is-link is-outlined is-small" onClick={toggleGear}>
            Toggle manage table
          </button>
          <button onclick={openModal} class="button is-small is-outlined is-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
    <Confirm ref={modal} canceller={closeModal} title="Confirm deletion" actionName="Delete" action={rmDecision}>
      <p>You are about to delete "{props.decision.title}"</p>
      <p>This action cannot be undone!</p>
    </Confirm>
    <div class="card-footer">
      <span class="card-footer-item"><p>{getRank()}</p></span>
    </div>
  </div>
};
