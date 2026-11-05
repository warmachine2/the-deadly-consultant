import { useEffect, useRef, useState } from "react";

const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";
interface CalendlyApi {
  initInlineWidget: (options: { url: string; parentElement: HTMLElement; resize: boolean }) => void;
}

const CalendlyInlineWidget = ({ url = "https://calendly.com/hassan-hammer/30min" }: { url?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [widgetHeight, setWidgetHeight] = useState(1060);
  const embedUrl = new URL(url);
  embedUrl.searchParams.set("hide_gdpr_banner", "1");
  const widgetUrl = embedUrl.toString();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let active = true;
    const initialize = () => {
      const calendly = (window as Window & { Calendly?: CalendlyApi }).Calendly;
      if (active && calendly && !container.querySelector("iframe")) {
        calendly.initInlineWidget({ url: widgetUrl, parentElement: container, resize: true });
      }
    };
    // Manual initialization also works when the script loaded before this screen mounted.
    let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
    script.addEventListener("load", initialize);
    initialize();
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://calendly.com" || event.source !== container.querySelector("iframe")?.contentWindow) return;
      if (event.data?.event !== "calendly.page_height") return;
      const height = Number(event.data?.payload?.height);
      if (Number.isFinite(height) && height > 400) setWidgetHeight(Math.max(1060, height + 40));
    };
    window.addEventListener("message", handleMessage);
    return () => {
      active = false;
      script?.removeEventListener("load", initialize);
      window.removeEventListener("message", handleMessage);
      container.replaceChildren();
    };
  }, [widgetUrl]);

  return <div ref={containerRef} className="calendly-inline-widget bg-accent rounded-xl overflow-hidden"
    data-url={widgetUrl} data-resize="true" style={{ minWidth: "100%", width: "100%", height: `${widgetHeight}px`, overflow: "hidden" }} />;
};

export default CalendlyInlineWidget;