import { createSignal } from "solid-js";

interface CopyButtonProps {
  text: string;
  label?: string;
}

export default function CopyButton(props: CopyButtonProps) {
  const [copied, setCopied] = createSignal(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(props.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied() ? "Copied!" : (props.label ?? "Copy to clipboard")}
    >
      {copied() ? "Copied!" : (props.label ?? "Copy")}
    </button>
  );
}
