import { atom, computed } from "nanostores"

// Static Node Animation
export const inputValue = atom("42");

// Static Memory Animation
export const currentValue = atom(0);

export const any = atom(false);
export const every = atom(false);
export const replaced = atom(false);
