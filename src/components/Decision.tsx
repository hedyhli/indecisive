import type { Component } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';

export const Decision: Component = () => {
	// Below is a testing demonstration of using basic signals
	let input

	// Storing a specific input field value
	const [value, setValue] = createSignal("Default name");
	// Signal for the element that will debug (show) the input value
	const [show, setShow] = createSignal("show");

	// Input value changed, store it
	const changed = () => {
		setValue((prev) => input.value);
	}
	// Debug button clicked, updated the showing element to reflect input value
	const showButton = () => {
		setShow((prev) => value())
	}

	// Actual decision table component I'll prolly use
	return <div class="card has-background-black-ter">
		<div class="card-content">
			<div class="level">
				<div class="level-left">
					<div class="level-item"><h3 class="subtitle">Decision 1</h3></div>
				</div>
				<div class="level-right">
					<div class="level-item"><button class="button is-small is-outlined is-danger">X</button></div>
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
