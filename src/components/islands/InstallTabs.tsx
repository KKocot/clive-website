import { createSignal, onMount, Show } from "solid-js";
import CopyButton from "./CopyButton";
import { LINKS } from "../../config/links";

type TabId = "linux" | "macos" | "windows";

interface Tab {
  id: TabId;
  label: string;
  command: string;
  note?: string;
}

const INSTALL_CMD = `bash <(curl -s ${LINKS.INSTALL_SCRIPT})`;

const TABS: Tab[] = [
  {
    id: "linux",
    label: "Linux",
    command: INSTALL_CMD,
  },
  {
    id: "macos",
    label: "macOS",
    command: INSTALL_CMD,
    note: "Tested on macOS 13+",
  },
  {
    id: "windows",
    label: "Windows (WSL)",
    command: INSTALL_CMD,
    note: "WSL2 required — run inside your Linux distro",
  },
];

function detectOs(): TabId {
  if (typeof navigator === "undefined") return "linux";
  const platform = navigator.userAgent.toLowerCase();
  if (platform.includes("mac")) return "macos";
  if (platform.includes("win")) return "windows";
  return "linux";
}

export default function InstallTabs() {
  const [active, setActive] = createSignal<TabId>("linux");

  onMount(() => {
    setActive(detectOs());
  });

  const handleKey = (e: KeyboardEvent, currentIndex: number) => {
    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") nextIndex = (currentIndex + 1) % TABS.length;
    else if (e.key === "ArrowLeft")
      nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") nextIndex = 0;
    else if (e.key === "End") nextIndex = TABS.length - 1;
    if (nextIndex !== null) {
      e.preventDefault();
      const next = TABS[nextIndex];
      if (!next) return;
      setActive(next.id);
      const el = document.getElementById(`tab-${next.id}`);
      el?.focus();
    }
  };

  const activeTab = () => TABS.find((t) => t.id === active()) ?? TABS[0]!;

  return (
    <div class="install-tabs">
      <div
        class="install-tabs__list"
        role="tablist"
        aria-label="Installation method"
      >
        {TABS.map((tab, i) => (
          <button
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            class="install-tabs__tab"
            aria-selected={active() === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={active() === tab.id ? 0 : -1}
            data-active={active() === tab.id}
            onClick={() => setActive(tab.id)}
            onKeyDown={(e) => handleKey(e, i)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        class="install-tabs__panel"
        role="tabpanel"
        id={`panel-${activeTab().id}`}
        aria-labelledby={`tab-${activeTab().id}`}
      >
        <div class="install-tabs__code-wrap">
          <pre class="install-tabs__code">
            <code>{activeTab().command}</code>
          </pre>
          <div class="install-tabs__copy">
            <CopyButton text={activeTab().command} label="Copy" />
          </div>
        </div>

        <Show when={activeTab().note}>
          <p class="install-tabs__note">{activeTab().note}</p>
        </Show>
      </div>
    </div>
  );
}
