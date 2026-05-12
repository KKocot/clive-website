import { createSignal, onMount, onCleanup, Show } from "solid-js";

type Tab = "tui" | "cli";

interface WorkflowTabsProps {
  tuiHtml: string;
  cliHtml: string;
}

export default function WorkflowTabs(props: WorkflowTabsProps) {
  const [active, setActive] = createSignal<Tab>("tui");

  onMount(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<Tab>).detail;
      setActive(detail);
    };
    document.addEventListener("install-mode", handler);
    onCleanup(() => document.removeEventListener("install-mode", handler));
  });

  return (
    <>
      <Show when={active() === "tui"}>
        <div
          role="tabpanel"
          id="panel-tui"
          class="workflow-tabs__panel"
          aria-labelledby="mode-tui"
          innerHTML={props.tuiHtml}
        />
      </Show>
      <Show when={active() === "cli"}>
        <div
          role="tabpanel"
          id="panel-cli"
          class="workflow-tabs__panel"
          aria-labelledby="mode-cli"
          innerHTML={props.cliHtml}
        />
      </Show>
    </>
  );
}
