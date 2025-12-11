import { atom } from "nanostores"

export const currentValue = atom(0);
export const clicksPerNodes = atom([0, 0, 0, 0, 0])
export const clicked = atom<number[]>([]); // set as array to be possible retrigger with same value
export const cursorPosition = atom(0);

export const any = atom(false);
export const every = atom(false);
export const replaced = atom(false);

