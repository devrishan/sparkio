"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Filter } from "lucide-react";

import { cn } from "@/lib/utils";

type TaskType = "all" | "app" | "upi" | "social";

const options: { label: string; value: TaskType }[] = [
  { label: "All", value: "all" },
  { label: "App", value: "app" },
  { label: "UPI", value: "upi" },
  { label: "Social", value: "social" },
];

interface TaskTypeFilterProps {
  value: TaskType;
  onChange: (next: TaskType) => void;
}

export function TaskTypeFilter({ value, onChange }: TaskTypeFilterProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const activeLabel = options.find((option) => option.value === value)?.label ?? "All";

  const handleSelect = (next: TaskType) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 transition",
          "hover:border-orange-400 hover:text-white"
        )}
      >
        <Filter className="h-3.5 w-3.5 text-orange-300" />
        <span>Task type: {activeLabel}</span>
        <ChevronDown
          className={cn(
            "h-3 w-3 text-white/60 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-36 rounded-xl border border-white/10 bg-[#050509] p-1 shadow-xl">
          {options.map((option) => {
            const isActive = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs text-white/80 transition",
                  "hover:bg-white/5",
                  isActive && "text-orange-200"
                )}
              >
                {option.label}
                {isActive ? (
                  <span className="h-2 w-2 rounded-full bg-orange-400" aria-hidden="true" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-transparent" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

