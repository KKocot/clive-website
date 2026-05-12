import { Show } from "solid-js";
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
    <>
      <Show when={mode() === "tui"}>
        <div
          role="tabpanel"
          id={`${props.panelId}-panel-tui`}
          class="workflow-tabs__panel"
          aria-labelledby={`${props.panelId}-tui`}
          innerHTML={props.tuiHtml}
        />
      </Show>
      <Show when={mode() === "cli"}>
        <div
          role="tabpanel"
          id={`${props.panelId}-panel-cli`}
          class="workflow-tabs__panel"
          aria-labelledby={`${props.panelId}-cli`}
          innerHTML={props.cliHtml}
        />
      </Show>
    </>
  );
}
