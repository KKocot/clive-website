import { createSignal, onMount, onCleanup, createMemo, Show } from "solid-js";

interface TypewriterTextProps {
  /** Full text to reveal character by character */
  text: string;
  /** Accent portion at the end (rendered with accent color) */
  accentText?: string;
  /** Milliseconds per character (default: CSS --typewriter-speed or 50ms) */
  speed?: number;
  /** Milliseconds delay before animation starts */
  delay?: number;
  /** Additional CSS classes for the wrapper element */
  class?: string;
}

/**
 * TypewriterText — SolidJS island for character-by-character text reveal.
 *
 * Zero CLS strategy:
 * - SSR renders full text visible (sizer layer) + cursor, no overlay.
 * - On hydration, JS hides sizer, shows overlay, and begins typing animation.
 * - Both layers occupy the same grid cell, so layout never shifts.
 *
 * Respects prefers-reduced-motion: shows full text immediately, no animation.
 */
export default function TypewriterText(props: TypewriterTextProps) {
  const speed = () => props.speed ?? 50;
  const delay = () => props.delay ?? 0;
  const fullText = createMemo(() =>
    props.accentText ? props.text + props.accentText : props.text,
  );
  const totalChars = createMemo(() => fullText().length);

  const [charIndex, setCharIndex] = createSignal(0);
  const [hydrated, setHydrated] = createSignal(false);
  const [started, setStarted] = createSignal(false);
  const [finished, setFinished] = createSignal(false);

  let delayTimer: ReturnType<typeof setTimeout> | undefined;
  let interval: ReturnType<typeof setInterval> | undefined;

  onMount(() => {
    // Check reduced motion preference
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setCharIndex(totalChars());
      setStarted(true);
      setFinished(true);
      setHydrated(true);
      return;
    }

    // Mark hydrated — this hides the sizer text and shows the overlay
    setHydrated(true);

    // Start typing after delay
    delayTimer = setTimeout(() => {
      setStarted(true);
      interval = setInterval(() => {
        setCharIndex((prev) => {
          const next = prev + 1;
          if (next >= totalChars()) {
            clearInterval(interval);
            setFinished(true);
            return totalChars();
          }
          return next;
        });
      }, speed());
    }, delay());
  });

  onCleanup(() => {
    if (delayTimer) clearTimeout(delayTimer);
    if (interval) clearInterval(interval);
  });

  // Split point between main text and accent text
  const mainLen = () => props.text.length;

  // Visible portion of main text
  const visibleMain = () => {
    const idx = charIndex();
    if (idx >= mainLen()) return props.text;
    return props.text.slice(0, idx);
  };

  // Visible portion of accent text
  const visibleAccent = () => {
    if (!props.accentText) return "";
    const idx = charIndex();
    if (idx <= mainLen()) return "";
    const accentIdx = idx - mainLen();
    return props.accentText.slice(0, accentIdx);
  };

  return (
    <span
      class={`typewriter ${props.class ?? ""}`}
      aria-label={fullText()}
    >
      {/* Sizer: visible on SSR, hidden after hydration — prevents CLS */}
      <span
        class="typewriter__sizer"
        classList={{ "typewriter__sizer--hidden": hydrated() }}
        aria-hidden="true"
      >
        {props.text}
        {props.accentText && (
          <span class="typewriter__accent">{props.accentText}</span>
        )}
        <span class="typewriter__cursor typewriter__cursor--blink">{"▊"}</span>
      </span>

      {/* Overlay: hidden on SSR, shown after hydration with typing animation */}
      <span
        class="typewriter__overlay"
        classList={{ "typewriter__overlay--active": hydrated() }}
        aria-hidden="true"
      >
        <span class="typewriter__typed">
          {visibleMain()}
          <Show when={props.accentText && visibleAccent().length > 0}>
            <span class="typewriter__accent">{visibleAccent()}</span>
          </Show>
        </span>
        <Show when={started()}>
          <span
            class="typewriter__cursor"
            classList={{ "typewriter__cursor--blink": finished() }}
          >
            {"▊"}
          </span>
        </Show>
      </span>
    </span>
  );
}
