import { writable } from "svelte/store";

export const dim = writable(20);

export const debug = writable(false);

export const start_x = writable(5);
export const start_y = writable(7);
export const dest_x = writable(17);
export const dest_y = writable(17);
