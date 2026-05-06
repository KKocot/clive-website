import { createSignal } from "solid-js";

interface NavItem {
  href: string;
  label: string;
}

interface MobileNavProps {
  items: NavItem[];
}

export default function MobileNav(props: MobileNavProps) {
  const [open, setOpen] = createSignal(false);

  return (
    <div class="mobile-nav">
      <button
        type="button"
        aria-label={open() ? "Close menu" : "Open menu"}
        aria-expanded={open()}
        onClick={() => setOpen((v) => !v)}
      >
        {open() ? "X" : "Menu"}
      </button>
      {open() && (
        <nav aria-label="Mobile navigation">
          <ul>
            {props.items.map((item) => (
              <li>
                <a href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
