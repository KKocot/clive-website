import { createSignal } from "solid-js";

type Mode = "tui" | "cli";

export default function InstallModeSwitch() {
  const [mode, setMode] = createSignal<Mode>("tui");

  const switchMode = (m: Mode) => {
    setMode(m);
    document.dispatchEvent(new CustomEvent("install-mode", { detail: m }));
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
      document.getElementById(`mode-${modes[next]}`)?.focus();
    }
  };

  return (
    <div
      class="install-mode-switch"
      role="tablist"
      aria-label="Installation mode"
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        role="tab"
        id="mode-tui"
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
        id="mode-cli"
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
