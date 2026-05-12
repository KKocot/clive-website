import { createSignal } from "solid-js";

type Mode = "tui" | "cli";

interface InstallModeSwitchProps {
  /** CustomEvent name dispatched on `document`. Default: `"install-mode"`. */
  channel?: string;
  /** Extra CSS class added to the root element. */
  class?: string;
  /** Accessible label for the tablist. */
  ariaLabel?: string;
}

export default function InstallModeSwitch(props: InstallModeSwitchProps) {
  const channel = () => props.channel ?? "install-mode";
  const idPrefix = () => channel();
  const [mode, setMode] = createSignal<Mode>("tui");

  const switchMode = (m: Mode) => {
    setMode(m);
    document.dispatchEvent(new CustomEvent(channel(), { detail: m }));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const modes: Mode[] = ["tui", "cli"];
    const idx = modes.indexOf(mode());
    let next: number | null = null;

    if (e.key === "ArrowRight") next = (idx + 1) % modes.length;
    else if (e.key === "ArrowLeft")
      next = (idx - 1 + modes.length) % modes.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = modes.length - 1;

    if (next !== null) {
      e.preventDefault();
      switchMode(modes[next]);
      document.getElementById(`${idPrefix()}-${modes[next]}`)?.focus();
    }
  };

  return (
    <div
      class={`install-mode-switch${props.class ? ` ${props.class}` : ""}`}
      role="tablist"
      aria-label={props.ariaLabel ?? "Installation mode"}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        role="tab"
        id={`${idPrefix()}-tui`}
        class="install-mode-switch__tab"
        classList={{ "install-mode-switch__tab--active": mode() === "tui" }}
        aria-selected={mode() === "tui"}
        tabIndex={mode() === "tui" ? 0 : -1}
        onClick={() => switchMode("tui")}
      >
        TUI
      </button>
      <button
        type="button"
        role="tab"
        id={`${idPrefix()}-cli`}
        class="install-mode-switch__tab"
        classList={{ "install-mode-switch__tab--active": mode() === "cli" }}
        aria-selected={mode() === "cli"}
        tabIndex={mode() === "cli" ? 0 : -1}
        onClick={() => switchMode("cli")}
      >
        CLI
      </button>
    </div>
  );
}
