"use client";

import { useMemo, useState } from "react";
import { compare, monthLabel, type Debt } from "@/lib/payoff";

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const money2 = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

type Row = { name: string; balance: string; apr: string; min: string };

/** Os mesmos cinco do arquivo de exemplo, para a página abrir já respondendo. */
const INICIAL: Row[] = [
  { name: "Store card", balance: "980", apr: "8.9", min: "35" },
  { name: "Credit card A", balance: "9400", apr: "24.99", min: "235" },
  { name: "Credit card B", balance: "3150", apr: "19.99", min: "95" },
  { name: "Car loan", balance: "8600", apr: "6.89", min: "265" },
  { name: "Student loan", balance: "12400", apr: "5.45", min: "140" },
];

const num = (s: string) => {
  const n = parseFloat(s.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

export default function Calculator() {
  const [rows, setRows] = useState<Row[]>(INICIAL);
  const [extra, setExtra] = useState("250");

  const set = (i: number, k: keyof Row, v: string) =>
    setRows((r) => r.map((row, j) => (j === i ? { ...row, [k]: v } : row)));

  const debts: Debt[] = useMemo(
    () =>
      rows.map((r) => ({
        name: r.name.trim() || "Untitled debt",
        balance: num(r.balance),
        apr: num(r.apr) / 100,
        min: num(r.min),
      })),
    [rows],
  );

  const c = useMemo(() => compare(debts, num(extra)), [debts, extra]);
  const totalDebt = debts.reduce((a, d) => a + d.balance, 0);
  const totalMin = debts.reduce((a, d) => a + (d.balance > 0 ? d.min : 0), 0);
  const now = new Date();

  const cheaper = c.interestSaved > 0.5 ? "avalanche" : c.interestSaved < -0.5 ? "snowball" : "tie";

  const input =
    "w-full rounded-lg border border-rule bg-white px-3 py-2 text-[15px] tabular-nums " +
    "focus:border-ink focus:outline-none";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-12">
      {/* ── entradas ─────────────────────────────────────────── */}
      {/* `min-w-0`: item de grid tem `min-width: auto`, entao sem isto a
          coluna cresce ate a largura da tabela (560px) e a PAGINA inteira
          passa a rolar na horizontal no celular -- medido, 205px de vazamento.
          O `overflow-x-auto` de dentro so segura depois que o pai aceita
          encolher. */}
      <div className="min-w-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="text-[12px] uppercase tracking-[0.09em] text-slate">
                <th className="pb-2 pr-3 font-semibold">Debt</th>
                <th className="pb-2 pr-3 font-semibold">Balance</th>
                <th className="pb-2 pr-3 font-semibold">APR&nbsp;%</th>
                <th className="pb-2 font-semibold">Minimum</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-rule">
                  <td className="py-2 pr-3">
                    <input
                      className={input}
                      value={r.name}
                      aria-label={`Debt ${i + 1} name`}
                      onChange={(e) => set(i, "name", e.target.value)}
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      className={input}
                      inputMode="decimal"
                      value={r.balance}
                      aria-label={`Debt ${i + 1} balance`}
                      onChange={(e) => set(i, "balance", e.target.value)}
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      className={input}
                      inputMode="decimal"
                      value={r.apr}
                      aria-label={`Debt ${i + 1} APR`}
                      onChange={(e) => set(i, "apr", e.target.value)}
                    />
                  </td>
                  <td className="py-2">
                    <input
                      className={input}
                      inputMode="decimal"
                      value={r.min}
                      aria-label={`Debt ${i + 1} minimum payment`}
                      onChange={(e) => set(i, "min", e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-x-8 gap-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[12px] uppercase tracking-[0.09em] text-slate">
              Extra each month
            </span>
            <input
              className={`${input} max-w-[160px]`}
              inputMode="decimal"
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
            />
          </label>

          <button
            type="button"
            onClick={() => setRows((r) => [...r, { name: "", balance: "", apr: "", min: "" }])}
            className="rounded-full border border-ink px-4 py-2 text-[14px] font-medium transition-colors hover:bg-ink hover:text-white"
          >
            Add a debt
          </button>

          <p className="text-[14px] text-slate">
            {money(totalDebt)} owed · {money(totalMin + num(extra))} a month
          </p>
        </div>
      </div>

      {/* ── resultado ────────────────────────────────────────── */}
      <div className="rounded-2xl bg-cool p-6 sm:p-7">
        {c.neverClears ? (
          <>
            <h2 className="t-section text-[1.5rem]">This never clears.</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              At least one balance is growing faster than it is being paid — the
              minimum is smaller than the monthly interest. Raise a minimum or
              the extra payment and the plan will start to close.
            </p>
          </>
        ) : totalDebt <= 0 ? (
          <p className="text-[15px] text-ink-soft">
            Put a balance in and both plans work themselves out.
          </p>
        ) : (
          <>
            <p className="text-[12px] uppercase tracking-[0.09em] text-slate">
              {cheaper === "tie" ? "Same cost either way" : `${cheaper === "avalanche" ? "Avalanche" : "Snowball"} costs less`}
            </p>
            <p className="mt-2 font-mono text-[2.6rem] font-medium leading-none tracking-tight text-ink">
              {money2(Math.abs(c.interestSaved))}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
              {cheaper === "tie"
                ? "The two orders cost the same on these numbers, so take the snowball — you see a debt disappear sooner."
                : `less interest, and ${
                    Math.abs(c.monthsSaved) === 0
                      ? "the same number of months"
                      : `${Math.abs(c.monthsSaved)} month${Math.abs(c.monthsSaved) === 1 ? "" : "s"} sooner`
                  }.`}
            </p>

            <table className="mt-6 w-full border-collapse text-[14.5px]">
              <thead>
                <tr className="text-[12px] uppercase tracking-[0.09em] text-slate">
                  <th className="pb-2 text-left font-semibold">Plan</th>
                  <th className="pb-2 text-right font-semibold">Months</th>
                  <th className="pb-2 text-right font-semibold">Debt-free</th>
                  <th className="pb-2 text-right font-semibold">Interest</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {([["Snowball", c.snowball], ["Avalanche", c.avalanche]] as const).map(
                  ([nome, p]) => (
                    <tr key={nome} className="border-t border-rule">
                      <td className="py-2.5 font-medium">{nome}</td>
                      <td className="py-2.5 text-right">{p.months}</td>
                      <td className="py-2.5 text-right">{monthLabel(now, p.months)}</td>
                      <td className="py-2.5 text-right">{money2(p.interest)}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>

            <p className="mt-5 text-[12px] uppercase tracking-[0.09em] text-slate">
              Avalanche payoff order
            </p>
            <ol className="mt-2 space-y-1 text-[14.5px] text-ink-soft">
              {c.avalanche.order.map((nome, i) => (
                <li key={nome + i} className="flex justify-between gap-4 tabular-nums">
                  <span className="truncate">
                    {i + 1}. {nome}
                  </span>
                  <span className="shrink-0 text-slate">
                    {c.avalanche.clearedAt[
                      debts.findIndex((d) => d.name === nome)
                    ]
                      ? monthLabel(
                          now,
                          c.avalanche.clearedAt[
                            debts.findIndex((d) => d.name === nome)
                          ] as number,
                        )
                      : "—"}
                  </span>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </div>
  );
}
