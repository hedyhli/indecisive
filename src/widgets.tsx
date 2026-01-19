import type { Component, JSX } from 'solid-js';

import './assets/fontawesome/css/all.min.css';

/**
 * Return an opener and closer for the el() modal.
 *
 * Example:
 * ```ts
 * let modal!: HTMLDivElement;
 * const [openModal, closeModal] = useConfirmModal(() => modal);
 *
 * // ...
 *
 * <button onclick={openModal}></button>
 * <Confirm ref={modal} canceller={closeModal} ...><Confirm/>
 * ```
 * */
export const useConfirmModal = (el: () => HTMLDivElement) => {
  return [
    () => el().classList.add("is-active"),
    () => el().classList.remove("is-active"),
  ]
}

/**
 * To be used with useConfirmModal.
 */
export const Confirm: Component<{
  action: JSX.EventHandler<HTMLButtonElement, MouseEvent>,
  actionName: string,
  title: string,
  children: JSX.Element,
  ref: HTMLDivElement,
  canceller: JSX.EventHandler<HTMLButtonElement, MouseEvent>,
}> = (props) => {

  return (
    <div class="modal" ref={props.ref}>
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="card">
          <div class="card-header card-header-themed">
            <p class="card-header-title">{props.title}</p>
            <button onclick={props.canceller} class="card-header-icon" aria-label="close">
              <span class="icon"><i class="fa-solid fa-xmark"></i></span>
            </button>
          </div>
          <div class="card-content">
            {props.children}
          </div>
          <div class="card-footer">
            <div class="level is-mobile card-footer-item is-justify-content-flex-end">
              <button onClick={props.canceller} class="button is-text level-item">Cancel</button>
              <button onClick={props.action} class="button is-danger level-item">
                {props.actionName}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
