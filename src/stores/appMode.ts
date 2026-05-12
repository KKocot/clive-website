import { atom } from "nanostores";

export type AppMode = "tui" | "cli";

export const $appMode = atom<AppMode>("tui");
