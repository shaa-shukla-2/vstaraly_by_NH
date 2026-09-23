"use client";

import { useMemo, useState } from "react";
import { cn, isoDate } from "@/lib/utils";

export function RentalCalendar({
  blocked,
  start,
  end,
  onChange,
}: {
  blocked: string[];
  start?: string;
  end?: string;
  onChange: (start: string, end: string) => void;
}) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const cells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    const list: (string | null)[] = Array.from({ length: first }, () => null);
    for (let d = 1; d <= days; d++) list.push(isoDate(new Date(year, month, d)));
    return list;
  }, [cursor]);

  const blockedSet = new Set(blocked);
  const today = isoDate(new Date());

  function pick(day: string) {
    if (blockedSet.has(day) || day < today) return;
    if (!start || (start && end)) {
      onChange(day, day);
      return;
    }
    if (day < start) {
      onChange(day, start);
      return;
    }
    const span: string[] = [];
    const a = new Date(`${start}T00:00:00`);
    const b = new Date(`${day}T00:00:00`);
    for (let t = a.getTime(); t <= b.getTime(); t += 86400000) {
      span.push(isoDate(new Date(t)));
    }
    if (span.some((d) => blockedSet.has(d))) return;
    onChange(start, day);
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.18em]">
          {cursor.toLocaleString("en-IN", { month: "long", year: "numeric" })}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() =>
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
            }
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() =>
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
            }
          >
            →
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-[0.12em] text-muted">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={`${d}-${i}`}>{d}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <span key={`e-${i}`} />;
          const isBlocked = blockedSet.has(day) || day < today;
          const inRange = start && end && day >= start && day <= end;
          const isStart = day === start;
          const isEnd = day === end;
          return (
            <button
              key={day}
              type="button"
              disabled={isBlocked}
              onClick={() => pick(day)}
              className={cn(
                "h-9 text-sm",
                isBlocked && "text-muted/40 line-through",
                inRange && "bg-ivory-deep",
                (isStart || isEnd) && "bg-wine text-ivory",
              )}
            >
              {Number(day.slice(-2))}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted">
        Struck dates are already reserved. Typical rental is four days including delivery.
      </p>
    </div>
  );
}
