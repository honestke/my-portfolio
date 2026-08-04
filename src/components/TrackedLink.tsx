"use client";

import type { ComponentProps } from "react";
import { trackEvent } from "@/lib/track-client";

type Props = ComponentProps<"a"> & {
  eventKind: "download" | "outbound_click";
  eventTarget: string;
};

export function TrackedLink({ eventKind, eventTarget, onClick, ...rest }: Props) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        trackEvent(eventKind, { target: eventTarget });
        onClick?.(e);
      }}
    />
  );
}
