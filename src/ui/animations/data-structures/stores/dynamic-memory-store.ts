import { atom } from "nanostores"

export const current = atom(0);

export const nodes = atom<HTMLElement[]>([]);

export const first = atom(false);
export const fifith = atom(false);
export const removed = atom(false);
export const dragged = atom(false);
