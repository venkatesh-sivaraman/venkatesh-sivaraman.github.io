import { writable } from 'svelte/store';

export default function statefulSwap(initialState) {
  const { subscribe, set, update } = writable(initialState);

  let curr = initialState;
  subscribe((val) => (curr = val));

  let nextState = null;

  function transitionTo(newState) {
    if (nextState === newState) return;
    nextState = newState;
    set(null);
  }

  function onOutro() {
    set(nextState);
  }

  return {
    subscribe,
    onOutro,
    set(val) {
      if (val != curr) transitionTo(val);
    },
    update(func) {
      transitionTo(func(curr));
    },
  };
}
