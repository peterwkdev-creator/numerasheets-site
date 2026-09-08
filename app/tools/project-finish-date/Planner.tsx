"use client";

import { useMemo, useState } from "react";
import { fmt, schedule, type Task } from "@/lib/schedule";

type Row = { name: string; waitsFor: string; days: string };

/**
 * Um relançamento de site — o mesmo caso do arquivo de exemplo, encurtado de
 * dezoito para oito tarefas. A página abre já respondendo, e a cadeia é longa
 * o bastante para o atraso viajar de verdade quando alguém edita um número.
 */
const INICIAL: Row[] = [
  { name: "Agree the scope", waitsFor: "0", days: "5" },
  { name: "Write the copy", waitsFor: "1", days: "10" },
  { name: "Design the pages", waitsFor: "1", days: "12" },
  { name: "Build the front end", waitsFor: "3", days: "15" },
  { name: "Migrate the content", waitsFor: "2", days: "6" },
  { name: "Test on real devices", waitsFor: "4", days: "5" },
  { name: "Fix what testing found", waitsFor: "6", days: "7" },
  { name: "Launch", waitsFor: "7", days: "1" },
];

const hoje = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};
const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
/** `new Date("2026-09-08")` é UTC e volta um dia em fuso negativo. Este não. */
const daIso = (s: string) => {
  const [a, m, d] = s.split("-").map(Number);
  return a && m && d ? new Date(a, m - 1, d) : null;
};

const num = (s: string) => {
  const n = parseInt(s.replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
};

export default function Planner() {
  const inicio = hoje();
  const [rows, setRows] = useState<Row[]>(INICIAL);
  const [startStr, setStartStr] = useState(iso(inicio));
  const [targetStr, setTargetStr] = useState(iso(new Date(inicio.getTime() + 55 * 86_400_000)));

  const set = (i: number, k: keyof Row, v: string) =>
    setRows((r) => r.map((row, j) => (j === i ? { ...row, [k]: v } : row)));

  const tasks: Task[] = useMemo(
    () =>
      rows.map((r) => ({
        name: r.name.trim() || "Untitled task",
        waitsFor: num(r.waitsFor),
        days: num(r.days),
      })),
    [rows],
  );

  const start = daIso(startStr) ?? inicio;
  const target = daIso(targetStr);
  const s = useMemo(() => schedule(tasks, start, target), [tasks, start, target]);

  const cabe = s.slack === null ? null : s.slack >= 0;

  const input =
    "w-full rounded-btn border border-rule bg-white px-3 py-2 text-[15px] tabular-nums " +
    "focus:border-ink focus:outline-none";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:gap-12">
      {/* ── entradas ─────────────────────────────────────────── */}
      {/* `min-w-0` pelo mesmo motivo da calculadora de dívida: item de grid tem
          `min-width: auto` e sem isto a página inteira rola na horizontal no
          celular. */}
      <div className="min-w-0">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[12px] uppercase tracking-[0.09em] text-slate">
              Project starts
            </span>
            <input
              type="date"
              value={startStr}
              onChange={(e) => setStartStr(e.target.value)}
              className={`${input} mt-1.5`}
            />
          </label>
          <label className="block">
            <span className="text-[12px] uppercase tracking-[0.09em] text-slate">
              You promised
            </span>
            <input
              type="date"
              value={targetStr}
              onChange={(e) => setTargetStr(e.target.value)}
              className={`${input} mt-1.5`}
            />
          </label>
        </div>

        <div
          className="mt-8 overflow-x-auto"
          tabIndex={0}
          role="region"
          aria-label="Tasks — scroll sideways to see every column"
        >
          <table className="w-full min-w-[620px] border-collapse text-left">
            <thead>
              <tr className="text-[12px] uppercase tracking-[0.09em] text-slate">
                <th className="pb-2 pr-3 font-semibold">#</th>
                <th className="pb-2 pr-3 font-semibold">Task</th>
                <th className="pb-2 pr-3 font-semibold">Waits&nbsp;for</th>
                <th className="pb-2 pr-3 font-semibold">Days</th>
                <th className="pb-2 pr-3 font-semibold">Start</th>
                <th className="pb-2 font-semibold">Finish</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const calc = s.rows[i];
                return (
                  <tr key={i} className="border-t border-rule">
                    <td className="py-2 pr-3 font-mono text-[13px] text-slate">{i + 1}</td>
                    <td className="py-2 pr-3">
                      <input
                        value={r.name}
                        onChange={(e) => set(i, "name", e.target.value)}
                        aria-label={`Task ${i + 1} name`}
                        className={`${input} min-w-[9rem]`}
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        inputMode="numeric"
                        value={r.waitsFor}
                        onChange={(e) => set(i, "waitsFor", e.target.value)}
                        aria-label={`Task ${i + 1} waits for which task`}
                        className={`${input} w-[4.5rem]`}
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        inputMode="numeric"
                        value={r.days}
                        onChange={(e) => set(i, "days", e.target.value)}
                        aria-label={`Task ${i + 1} duration in days`}
                        className={`${input} w-[4.5rem]`}
                      />
                    </td>
                    <td className="whitespace-nowrap py-2 pr-3 text-[14px] tabular-nums text-ink-soft">
                      {calc ? fmt(calc.start) : "—"}
                    </td>
                    <td className="whitespace-nowrap py-2 text-[14px] tabular-nums text-ink-soft">
                      {calc ? fmt(calc.finish) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-[13.5px] leading-relaxed text-slate">
          Change any duration and watch the dates below move. “Waits for” takes
          the number of a task <strong className="font-semibold">above</strong>{" "}
          this one, or 0 for none — the same constraint the workbook has, and
          what lets the dates work themselves out without a macro.
        </p>
      </div>

      {/* ── resultado ────────────────────────────────────────── */}
      <div className="rounded-card bg-cool p-6 sm:p-7">
        <p className="text-[12px] uppercase tracking-[0.09em] text-slate">
          Project finishes
        </p>
        <p className="mt-2 text-[2rem] font-bold leading-none tracking-[-0.02em] tabular-nums">
          {s.finish ? fmt(s.finish) : "—"}
        </p>

        {s.slack !== null ? (
          <p
            className={`mt-4 text-[15px] leading-relaxed ${
              cabe ? "text-ink-soft" : "font-semibold text-[#B4232C]"
            }`}
          >
            {cabe
              ? `${s.slack} day${s.slack === 1 ? "" : "s"} of slack against the date you promised.`
              : `Late by ${Math.abs(s.slack)} day${Math.abs(s.slack) === 1 ? "" : "s"} — the plan does not fit.`}
          </p>
        ) : null}

        {s.driver ? (
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
            Task <strong className="font-semibold text-ink">#{s.driver}</strong>{" "}
            sets the finish date. Shorten anything else and the date does not
            move.
          </p>
        ) : null}

        <div className="mt-6 border-t border-rule pt-5">
          <p className="text-[12px] uppercase tracking-[0.09em] text-slate">
            What each row is waiting on
          </p>
          <ul className="mt-3 space-y-1.5 text-[14px] leading-relaxed text-ink-soft">
            {s.rows
              .filter((r) => r.note)
              .map((r) => (
                <li key={r.index}>
                  <span className="font-mono text-[13px] text-slate">#{r.index}</span>{" "}
                  {r.name} — {r.note}
                </li>
              ))}
            {s.rows.every((r) => !r.note) ? (
              <li>Nothing waits on anything — every task starts on day one.</li>
            ) : null}
          </ul>
        </div>

        <p className="mt-6 text-[13px] leading-relaxed text-slate">
          Days are calendar days, weekends included — same as the workbook. If
          your team works five days a week, plan the extra days in; the file
          will not invent them for you.
        </p>
      </div>
    </div>
  );
}
