import type { Component } from 'solid-js';
import { createSignal, createContext, useContext } from 'solid-js';
import type { SetStoreFunction } from 'solid-js/store';

type NotUndefined<T> = Exclude<T, undefined>;

export type TOption = {
	name: string;
	values: number[]
}

export type TFactor = {
	name: string;
	weight: number;
}

export type TDecision = {
	id: number;
	title: string;
	options: TOption[];
	factors: TFactor[];
}

export type DecisionStore = {
	d: TDecision[];
}

type storeTuple = [DecisionStore, SetStoreFunction<DecisionStore>];
export const DContext = createContext<NotUndefined<storeTuple>>()

export const JumpListItem: Component<{
	decision: TDecision,
}> = (props) => {
	return <li class="menu-list">
		<a href={`#decision${props.decision.id}`}>{props.decision.title}</a>
	</li>;
};

export const Decision: Component<{decision: TDecision}> = (props) => {
	const D = props.decision
	// TODO: Type it
	const {state, setState} = useContext(DContext);
	const rmDecision = (id: number) => setState("d", (d: TDecision[]) => d.filter((D) => D.id !== id))

	// Below is a testing demonstration of using basic signals
	let input: HTMLInputElement

	// Storing a specific input field value
	const [value, setValue] = createSignal("Default name");
	// Signal for the element that will debug (show) the input value
	const [show, setShow] = createSignal("show");

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
					<div class="level-item"><h3 class="subtitle">{D.title}</h3></div>
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
