"use client";

import { useId, useState } from "react";

export type Series = { name: string; color: string; points: number[] };

export type Fmt = "raw" | "pct" | "k";
const fmtFn = (f: Fmt = "raw") => (v: number) => (f === "pct" ? `${Math.round(v)}%` : f === "k" ? (v >= 1000 ? `${Math.round(v / 100) / 10}k` : `${Math.round(v)}`) : `${Math.round(v)}`);

export function LineChart({
  series,
  labels,
  height = 260,
  yMax,
  yTicks = 4,
  area = true,
  yFmt = "raw",
}: {
  series: Series[];
  labels: string[];
  height?: number;
  yMax?: number;
  yTicks?: number;
  area?: boolean;
  yFmt?: Fmt;
}) {
  const id = useId().replace(/:/g, "");
  const [hover, setHover] = useState<number | null>(null);
  const formatY = fmtFn(yFmt);
  const W = 1000;
  const H = height;
  const padL = 46, padR = 16, padT = 14, padB = 28;
  const max = yMax ?? Math.max(...series.flatMap((s) => s.points)) * 1.15;
  const x = (i: number) => padL + (i / Math.max(1, labels.length - 1)) * (W - padL - padR);
  const y = (v: number) => padT + (1 - v / max) * (H - padT - padB);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = (e.target as SVGElement).closest("svg")!.getBoundingClientRect();
          const rel = ((e.clientX - rect.left) / rect.width) * W;
          const i = Math.round(((rel - padL) / (W - padL - padR)) * (labels.length - 1));
          setHover(Math.max(0, Math.min(labels.length - 1, i)));
        }}>
        <defs>
          {series.map((s, si) => (
            <linearGradient key={si} id={`${id}-g${si}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {Array.from({ length: yTicks + 1 }, (_, t) => {
          const v = (max / yTicks) * t;
          return (
            <g key={t}>
              <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke="currentColor" strokeOpacity="0.08" />
              <text x={padL - 8} y={y(v) + 4} textAnchor="end" className="fill-current text-[11px] opacity-50" style={{ fontSize: 11 }}>{formatY(v)}</text>
            </g>
          );
        })}
        {series.map((s, si) => (
          <g key={si}>
            {area && <path d={`M${s.points.map((p, i) => `${x(i)},${y(p)}`).join(" L")} L${x(s.points.length - 1)},${y(0)} L${x(0)},${y(0)} Z`} fill={`url(#${id}-g${si})`} />}
            <path d={`M${s.points.map((p, i) => `${x(i)},${y(p)}`).join(" L")}`} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            {hover !== null && <circle cx={x(hover)} cy={y(s.points[hover])} r="4" fill={s.color} stroke="black" strokeWidth="1.5" />}
          </g>
        ))}
        {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={padT} y2={H - padB} stroke="currentColor" strokeOpacity="0.2" strokeDasharray="3 3" />}
        {labels.map((l, i) =>
          i % Math.ceil(labels.length / 7) === 0 ? (
            <text key={i} x={x(i)} y={H - 8} textAnchor="middle" className="fill-current opacity-50" style={{ fontSize: 11 }}>{l}</text>
          ) : null
        )}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute left-0 top-0 rounded-lg border border-white/10 bg-black/90 px-3 py-2 text-xs text-white shadow-xl" style={{ transform: `translateX(${(x(hover) / W) * 100}%)`, marginLeft: 12 }}>
          <p className="mb-1 opacity-60">{labels[hover]}</p>
          {series.map((s) => (
            <p key={s.name} className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: s.color }} />
              {s.name}: <span className="font-medium">{formatY(s.points[hover])}</span>
            </p>
          ))}
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-4">
        {series.map((s) => (
          <span key={s.name} className="flex items-center gap-2 text-xs opacity-70">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: s.color }} /> {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function StackedShareBar({ items }: { items: { label: string; pct: number; color: string }[] }) {
  const total = items.reduce((a, b) => a + b.pct, 0) || 1;
  const isDark = (hex: string) => {
    const c = hex.replace("#", "");
    if (c.length < 6) return false;
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16));
    return (r * 299 + g * 587 + b * 114) / 1000 < 150;
  };
  return (
    <div>
      <div className="flex h-9 w-full overflow-hidden rounded-lg">
        {items.map((it) => (
          <div key={it.label} className={`flex min-w-14 items-center justify-center text-xs font-medium ${isDark(it.color) ? "text-white/90" : "text-black/80"}`} style={{ width: `${(it.pct / total) * 100}%`, background: it.color }}>
            {it.pct >= 3 ? `${it.pct.toFixed(1)}%` : it.pct > 0 ? Math.round(it.pct) + "%" : ""}
          </div>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
        {items.map((it) => (
          <span key={it.label} className="flex items-center gap-1.5 text-xs opacity-75">
            <span className="inline-block h-2 w-2 rounded-sm" style={{ background: it.color }} /> {it.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function HBarList({ items, color = "#a78bfa", suffix = "%" }: { items: { label: string; value: number; sub?: string }[]; color?: string; suffix?: string }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div key={it.label}>
          <div className="mb-1 flex items-baseline justify-between text-sm">
            <span className="opacity-85">{it.label}</span>
            <span className="tabular-nums opacity-60">{it.value}{suffix}{it.sub ? ` · ${it.sub}` : ""}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-current/10">
            <div className="h-full rounded-full transition-all" style={{ width: `${(it.value / max) * 100}%`, background: color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ColumnChart({ items, height = 220, color = "#a78bfa", fmt = "raw" }: { items: { label: string; value: number }[]; height?: number; color?: string; fmt?: Fmt }) {
  const format = fmtFn(fmt);
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {items.map((it) => (
        <div key={it.label} className="group relative flex h-full flex-1 flex-col items-center justify-end gap-1.5">
          <div className="pointer-events-none absolute -top-1 hidden -translate-y-full rounded-md border border-white/10 bg-black px-2 py-1 text-xs group-hover:block">{format(it.value)}</div>
          <div className="w-full rounded-t-md transition-all group-hover:opacity-80" style={{ height: `${Math.max(2, (it.value / max) * 100)}%`, background: color }} />
          <span className="text-[10px] opacity-50">{it.label}</span>
        </div>
      ))}
    </div>
  );
}

export function Donut({ value, size = 120, stroke = 12, color = "#a78bfa", label }: { value: number; size?: number; stroke?: number; color?: string; label?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={`${(value / 100) * c} ${c}`} strokeLinecap="round" />
      </svg>
      <div className="absolute text-center">
        <p className="text-xl font-semibold tabular-nums">{Math.round(value)}%</p>
        {label && <p className="text-[10px] opacity-60">{label}</p>}
      </div>
    </div>
  );
}
