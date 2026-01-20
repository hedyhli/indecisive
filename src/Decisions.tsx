import type { Component } from 'solid-js';

import { createSignal, createMemo } from 'solid-js';
import { For, Show, Switch, Match } from 'solid-js/web';

import type { TDecision, TOption } from './model';
import { mustUseContext } from './model';
import { Confirm, useConfirmModal } from './widgets';

import './assets/fontawesome/css/all.min.css';

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
      ];
    });
  };

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
                <span class="icon is-hidden-tablet">
                  <i class="fa-solid fa-plus"></i>
                </span>
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
  </>;
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
            <input
              class="input" value={props.decision.title}
              onkeydown={editingTitle}></input>
          </Show>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <Show when={props.decision.editingTitle} fallback={
            <button
              onClick={startEditTitle}
              class="button is-small is-outlined is-primary">
              <span class="icon"><i class="fa-solid fa-pencil"></i></span>
            </button>
          }>
            <button class="button is-primary is-small" onclick={editedTitle}>
              <span class="icon"><i class="fa-solid fa-check"></i></span>
            </button>
            <button
              class="button is-danger is-text"
              onclick={cancelEditTitle}>Cancel</button>
          </Show>
        </div>
      </div>
    </div>
  );
}

const FactorName: Component<{decision: TDecision, i: number, f: number}> = (props) => {
  const {state, setState} = mustUseContext();
  const name = () => props.decision.factors[props.f].name;

  /**
   * Remove the factor name from list of factors, and remove the factor value
   * from each option.
   */
  const rmFactor = () => {
    let factors = [...props.decision.factors];
    if (factors.length == 1) {
      // Avoid deleting all factors.
      return;
    }
    // Delete factor
    factors.splice(props.f, 1);
    setState("d", props.i, {
      factors: factors,
      options: props.decision.options.map((opt: TOption) => {
        // Delete value for each option
        let values = [...opt.values]
        values.splice(props.f, 1)
        return { ...opt, values }
      }
    )});
  };

  /**
   * Add factor name to factor list, and add a default value to each option.
   */
  const addFactor = () => {
    setState("d", props.i, "factors", props.decision.factors.length,{
      name: `Factor ${props.decision.factors.length+1}`,
      weight: 100
    })
    setState("d", props.i, {
      options: props.decision.options.map((opt) => ({
        ...opt, values: [...opt.values, 50]
      }))
    })
  };
  const changedName = (e: Event) => {
    setState("d", props.i, "factors", props.f, "name",
      (e.target as HTMLSpanElement).textContent!.toString());
  };

  return (
    <div style="gap: 0" class="level" classList={{"is-mobile": !props.decision.gearing}}>
      <div style="min-width: 0;">
        <span
          style="white-space:nowrap;text-align:left;"
          class="level-item"
          classList={{
            "is-justify-content-flex-start": !props.decision.gearing,
            "has-text-weight-bold": !props.decision.gearing,
          }}
          role="textbox" contenteditable={!props.decision.gearing}
          onBlur={changedName}
          onFocus={(e) => e.target.textContent = name()}
        >
          {name()}
        </span>
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
            {/*<Match when={!props.decision.gearing}>
              <button class="button is-ghost" style="cursor:default;">
                <span class="icon"></span>
              </button>
            </Match>*/}
          </Switch>
        </div>
      </div>
    </div>
  );
}

/**
 * Table header with factor names.
 */
const TblHead: Component<{decision: TDecision, i: number}> = (props) => {
  const {state, setState} = mustUseContext();

  const addOption = () => setState(
    "d", props.i, "options", props.decision.options.length,
    { name: "Another Option", values: Array(props.decision.factors.length).fill(50) }
  );

  return (
    <tr classList={{"gearing": props.decision.gearing}}>
      <th style="position:sticky;left:0;top:0;z-index:6;"
        classList={{"card-themed": props.decision.gearing}}>
        <div class="level is-mobile">
          <div class="level-left">
            <span class="level-item">{props.decision.gearing?"":"Options"}</span>
          </div>
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
        <th
          classList={{"card-themed": props.decision.gearing}}
          style="position:sticky;top:0;z-index:5; vertical-align: middle;"
        >
          <FactorName {...props} f={f()} />
        </th>
      )}</For>
    </tr>
  );
}

/**
 * Table footer with factor weights.
 */
const TblFoot: Component<{decision: TDecision, i: number}> = (props) => {
  const {state, setState} = mustUseContext();
  const changedWeight = (w: number, e: Event) => setState(
    "d", props.i, "factors", w, "weight",
    parseFloat((e.target as HTMLSpanElement).textContent!.trim())
  );
  return (
    <tr classList={{"gearing": props.decision.gearing}}>
      <th style="vertical-align: middle;position:sticky;left:0;bottom:0;z-index:6;">
        {props.decision.gearing?"":"Weights"}
      </th>
      <For each={props.decision.factors}>{(F, i) => (
        <th style="position:sticky;bottom:0;z-index:5">
          <span
            contenteditable={!props.decision.gearing}
            onFocus={(e) => e.target.textContent = F.weight.toString()}
            onBlur={[changedWeight, i()]}>{F.weight}</span>
        </th>
      )}</For>
    </tr>
  );
}

/**
 * A row with option names and values.
 */
const TblRow: Component<{decision: TDecision, i: number, o: number}> = (props) => {
  const {state, setState} = mustUseContext();
  const O = () => props.decision.options[props.o];

  const rmOption = () => {
    if (props.decision.options.length == 1) {
      // Avoid deleting all options.
      return;
    }
    let options = [...props.decision.options];
    options.splice(props.o, 1);
    setState("d", props.i, "options", options);
  };
  const changedOption = (e: Event) => {
    setState("d", props.i, "options", props.o, "name",
      (e.target as HTMLSpanElement).textContent!.trim());
  };
  const changedValue = (v: number, e: Event) => {
    setState(
      "d", props.i, "options", props.o, "values", v,
      parseFloat((e.target as HTMLSpanElement).textContent!.trim())
    )
  };

  return <tr classList={{"gearing": props.decision.gearing}}>
    <td style={
      "white-space:nowrap;position:sticky;left:0;z-index:4;padding-right:0;"
        + (props.decision.gearing ? ";padding-left:0": "")
    }>
      {/* Delete option */}
      <Show when={props.decision.gearing}>
        <button class="button is-text has-text-danger"
          style="text-decoration: none" onClick={rmOption}>
          <span class="icon"><i class="fa-solid fa-trash" aria-hidden="true"></i></span>
        </button>
      </Show>
      {/* Option name */}
      <span style="width:min-content;height:1.5rem;"
        contenteditable={!props.decision.gearing}
        onFocus={(e) => e.target.textContent = O().name}
        onBlur={changedOption}>{O().name}</span>
    </td>
    {/* Values */}
    <For each={O().values}>{(val, v) => (
      <td style="vertical-align:middle;">
        <Show when={!props.decision.gearing} fallback={val}>
          <span style="height:1.5em;"
            contentEditable
            onFocus={(e) => e.target.textContent = val.toString()}
            onBlur={[changedValue, v()]}>{val}</span>
        </Show>
      </td>
    )}</For>
  </tr>;
}

const Table: Component<{decision: TDecision, i: number}> = (props) => {
  return <div class="table-container" style="max-height:30rem;overflow-y:auto;">
    <table class="table is-fullwidth card-themed">
      <thead><TblHead {...props} /></thead>
      <Show when={!props.decision.gearing}>
        <tfoot><TblFoot {...props} /></tfoot>
      </Show>
      <tbody>
        <For each={props.decision.options}>{
          (_, i) => <TblRow {...props} o={i()} />
        }</For>
      </tbody>
    </table>
  </div>;
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
  });
  const toggleGear = () => setState("d", props.i, {gearing: !state.d[props.i].gearing});

  // Actual decision table component I'll prolly use
    return <div class="card card-themed" id={`decision${props.decision.id}`}>
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
