import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "box"
  | "brush"
  | "check"
  | "clear"
  | "close"
  | "cloud"
  | "cube"
  | "download"
  | "erase"
  | "fit"
  | "grid"
  | "hand"
  | "key"
  | "lock"
  | "logout"
  | "mail"
  | "plus"
  | "redo"
  | "settings"
  | "shuffle"
  | "top"
  | "undo"
  | "upload"
  | "user";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

export function Icon({ name, ...props }: IconProps) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  const paths: Record<IconName, ReactNode> = {
    box: <><path d="M4 6.5 12 2l8 4.5v10L12 21l-8-4.5z"/><path d="m4 6.5 8 4.5 8-4.5M12 11v10"/></>,
    brush: <><path d="M4 17.5 16.5 5a2.1 2.1 0 0 1 3 3L7 20.5H3.5z"/><path d="m13.5 8 3 3"/></>,
    check: <path d="m5 12 5 5L20 7"/>,
    clear: <><path d="M4 7h16M9 7V4h6v3m-8 0 1 14h8l1-14M10 11v6m4-6v6"/></>,
    close: <path d="M18 6 6 18M6 6l12 12"/>,
    cloud: <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>,
    cube: <><path d="m12 2 8 4.5v11L12 22l-8-4.5v-11z"/><path d="m4 6.5 8 4.5 8-4.5M12 11v11"/></>,
    download: <><path d="M12 3v12m-4-4 4 4 4-4"/><path d="M5 20h14"/></>,
    erase: <><path d="m4 15 8.5-9a2 2 0 0 1 3 0l3 3a2 2 0 0 1 0 3L11 20H7z"/><path d="m10 9 7 7M11 20h9"/></>,
    fit: <><path d="M8 3H3v5m13-5h5v5M8 21H3v-5m18 0v5h-5"/><path d="M8 8h8v8H8z"/></>,
    grid: <><path d="M4 4h16v16H4zM4 10h16M10 4v16"/><path d="M10 15h10M15 10v10"/></>,
    hand: <path d="M7.5 12V7.5a1.5 1.5 0 0 1 3 0V11m0-5V4.5a1.5 1.5 0 0 1 3 0V11m0-5V5a1.5 1.5 0 0 1 3 0v7m0-4.5a1.5 1.5 0 0 1 3 0V14c0 4-2.5 7-6.5 7H11c-2.2 0-3.4-1.1-4.5-2.7L3.8 14a1.6 1.6 0 0 1 2.6-1.8l1.1 1.3z"/>,
    key: <><circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 8.3-8.3h4v4l-2 2v2l-2 2"/></>,
    lock: <><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></>,
    mail: <><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></>,
    plus: <path d="M5 12h14M12 5v14"/>,
    redo: <><path d="m15 5 4 4-4 4"/><path d="M19 9h-8a6 6 0 0 0-6 6v2"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    shuffle: <><path d="M17 3h4v4M3 6h4c5 0 5 12 10 12h4"/><path d="m17 15 4 3-4 3M3 18h4c1.7 0 2.8-1.4 3.8-3"/><path d="M13.2 9C14.2 7.3 15.3 6 17 6h4"/></>,
    top: <><path d="M4 4h16v16H4z"/><path d="M8 8h8v8H8zM4 10h4m8 4h4"/></>,
    undo: <><path d="m9 5-4 4 4 4"/><path d="M5 9h8a6 6 0 0 1 6 6v2"/></>,
    upload: <><path d="M12 16V4m-4 4 4-4 4 4"/><path d="M5 20h14"/></>,
    user: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  };

  return <svg {...common} {...props}>{paths[name]}</svg>;
}
