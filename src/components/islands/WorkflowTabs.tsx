import { useStore } from "@nanostores/solid";
import { $appMode } from "../../stores/appMode";

interface WorkflowTabsProps {
  tuiHtml: string;
  cliHtml: string;
  /** Unique prefix for ARIA IDs (e.g. "hero", "install", "demo"). */
  panelId: string;
}

export default function WorkflowTabs(props: WorkflowTabsProps) {
  const mode = useStore($appMode);

  return (
    <div data-mode={mode()} class="workflow-tabs__mode-root">
      <div
        role="tabpanel"
        id={`${props.panelId}-panel-tui`}
        class="workflow-tabs__panel"
        aria-label={`${props.panelId} — TUI mode`}
        aria-hidden={mode() !== "tui"}
        style={{ display: mode() === "tui" ? undefined : "none" }}
        innerHTML={props.tuiHtml}
      />
      <div
        role="tabpanel"
        id={`${props.panelId}-panel-cli`}
        class="workflow-tabs__panel"
        aria-label={`${props.panelId} — CLI mode`}
        aria-hidden={mode() !== "cli"}
        style={{ display: mode() === "cli" ? undefined : "none" }}
        innerHTML={props.cliHtml}
      />
    </div>
  );
}
