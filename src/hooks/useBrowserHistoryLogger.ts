import { useEffect } from "react";

export type HistoryLogEvent = {
  type: "pushState" | "replaceState" | "popstate";
  at: string;
  url: string;
  state: unknown;
};

const HISTORY_LOG_KEY = "__tabHistoryLabLog";

function readLog(): HistoryLogEvent[] {
  const existing = sessionStorage.getItem(HISTORY_LOG_KEY);
  return existing ? (JSON.parse(existing) as HistoryLogEvent[]) : [];
}

function writeLog(event: HistoryLogEvent) {
  const next = [event, ...readLog()].slice(0, 80);
  sessionStorage.setItem(HISTORY_LOG_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("history-log-changed"));
}

export function getHistoryLog(): HistoryLogEvent[] {
  return readLog();
}

export function clearHistoryLog() {
  sessionStorage.removeItem(HISTORY_LOG_KEY);
  window.dispatchEvent(new CustomEvent("history-log-changed"));
}

export function useBrowserHistoryLogger() {
  useEffect(() => {
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function patchedPushState(state, unused, url) {
      const result = originalPushState.apply(this, [state, unused, url]);
      writeLog({
        type: "pushState",
        at: new Date().toLocaleTimeString(),
        url: String(url ?? window.location.href),
        state,
      });
      return result;
    };

    window.history.replaceState = function patchedReplaceState(
      state,
      unused,
      url,
    ) {
      const result = originalReplaceState.apply(this, [state, unused, url]);
      writeLog({
        type: "replaceState",
        at: new Date().toLocaleTimeString(),
        url: String(url ?? window.location.href),
        state,
      });
      return result;
    };

    const onPopState = (event: PopStateEvent) => {
      writeLog({
        type: "popstate",
        at: new Date().toLocaleTimeString(),
        url: window.location.href,
        state: event.state,
      });
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", onPopState);
    };
  }, []);
}
