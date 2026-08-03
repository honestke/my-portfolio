"use client";

import { useEffect, useState } from "react";

const roles = [
  "Data Analyst",
  "AI Integration Specialist",
  "Statistics Enthusiast",
  "Power BI Developer",
  "Blockchain Researcher",
  "Website Developer",
];

const TYPING_SPEED = 65;
const DELETING_SPEED = 35;
const HOLD_MS = 1400;

export function TypingRoles() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === currentRole) {
      timeout = setTimeout(() => setDeleting(true), HOLD_MS);
    } else if (deleting && text === "") {
      timeout = setTimeout(() => {
        setDeleting(false);
        setRoleIndex((i) => (i + 1) % roles.length);
      }, TYPING_SPEED);
    } else {
      timeout = setTimeout(
        () => {
          setText((current) =>
            deleting
              ? current.slice(0, -1)
              : currentRole.slice(0, current.length + 1),
          );
        },
        deleting ? DELETING_SPEED : TYPING_SPEED,
      );
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, roleIndex]);

  return (
    <span className="text-gradient font-display">
      {text}
      <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-emerald align-middle" style={{ height: "1em" }} />
    </span>
  );
}
