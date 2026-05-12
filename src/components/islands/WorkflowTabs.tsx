import { createSignal, onMount, onCleanup, Show } from "solid-js";

type Tab = "tui" | "cli";

interface WorkflowTabsProps {
  tuiHtml: string;
  cliHtml: string;
  /** CustomEvent name to listen for. Must match the paired `InstallModeSwitch` channel. Default: `"install-mode"`. */
  channel?: string;
}

export default function WorkflowTabs(props: WorkflowTabsProps) {
  const channel = () => props.channel ?? "install-mode";
  const idPrefix = () => channel();
  const [active, setActive] = createSignal<Tab>("tui");

  onMount(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<Tab>).detail;
      setActive(detail);
    };
    document.addEventListener(channel(), handler);
    onCleanup(() => document.removeEventListener(channel(), handler));
  });

  return (
    <>
      <Show when={active() === "tui"}>
        <div
          role="tabpanel"
          id={`${idPrefix()}-panel-tui`}
          class="workflow-tabs__panel"
          aria-labelledby={`${idPrefix()}-tui`}
          innerHTML={props.tuiHtml}
        />
      </Show>
      <Show when={active() === "cli"}>
        <div
          role="tabpanel"
          id={`${idPrefix()}-panel-cli`}
          class="workflow-tabs__panel"
          aria-labelledby={`${idPrefix()}-cli`}
          innerHTML={props.cliHtml}
        />
      </Show>
    </>
  );
}
