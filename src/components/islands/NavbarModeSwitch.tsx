import { useStore } from "@nanostores/solid";
import { $appMode, type AppMode } from "../../stores/appMode";

/**
 * NavbarModeSwitch — tmux-tab-style TUI/CLI toggle for the navbar.
 * Subscribes to the global $appMode nanostore so every section reacts.
 *
 * Keyboard: ArrowLeft / ArrowRight / Home / End to switch tabs.
 * ARIA: role="tablist" with aria-selected tabs.
 */
export default function NavbarModeSwitch() {
  const mode = useStore($appMode);

  const modes: AppMode[] = ["tui", "cli"];

  const switchMode = (m: AppMode) => {
    $appMode.set(m);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const idx = modes.indexOf(mode());
    let next: number | null = null;

    if (e.key === "ArrowRight") next = (idx + 1) % modes.length;
    else if (e.key === "ArrowLeft")
      next = (idx - 1 + modes.length) % modes.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = modes.length - 1;

    if (next !== null) {
      e.preventDefault();
      const target = modes[next]!;
      switchMode(target);
      document.getElementById(`navbar-mode-${target}`)?.focus();
    }
  };

  return (
    <div
      class="mode-switch"
      role="tablist"
      aria-label="Application mode"
      onKeyDown={handleKeyDown}
    >
      <div
        class="mode-switch__indicator"
        style={{ transform: mode() === "cli" ? "translateX(100%)" : "translateX(0)" }}
      />
      <button
        type="button"
        role="tab"
        id="navbar-mode-tui"
        class="mode-switch__btn"
        classList={{ "mode-switch__btn--active": mode() === "tui" }}
        aria-selected={mode() === "tui"}
        tabIndex={mode() === "tui" ? 0 : -1}
        onClick={() => switchMode("tui")}
      >
        TUI
      </button>
      <button
        type="button"
        role="tab"
        id="navbar-mode-cli"
        class="mode-switch__btn"
        classList={{ "mode-switch__btn--active": mode() === "cli" }}
        aria-selected={mode() === "cli"}
        tabIndex={mode() === "cli" ? 0 : -1}
        onClick={() => switchMode("cli")}
      >
        CLI
      </button>
    </div>
  );
}
