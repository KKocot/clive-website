import { createSignal } from "solid-js";

type TabId = "pip" | "binary" | "docker";

interface Tab {
  id: TabId;
  label: string;
  command: string;
}

const TABS: Tab[] = [
  { id: "pip", label: "pip", command: "pip install clive" },
  { id: "binary", label: "Binary", command: "# Download binary from GitHub Releases" },
  { id: "docker", label: "Docker", command: "docker pull openhive/clive:latest" },
];

export default function InstallTabs() {
  const [active, setActive] = createSignal<TabId>("pip");

  const activeTab = () => TABS.find((t) => t.id === active())!;

  return (
    <div class="install-tabs">
      <div role="tablist" aria-label="Installation method">
        {TABS.map((tab) => (
          <button
            type="button"
            role="tab"
            aria-selected={active() === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`panel-${active()}`}
        aria-labelledby={`tab-${active()}`}
      >
        <pre>
          <code>{activeTab().command}</code>
        </pre>
      </div>
    </div>
  );
}
