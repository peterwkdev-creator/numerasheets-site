import { useSyncExternalStore } from "react";

/**
 * O "hoje" das duas calculadoras, sem erro de hidratação.
 *
 * Até 30/09/2026 cada uma chamava `new Date()` direto no render. O site é
 * export estático: o HTML congela o dia do BUILD, e o navegador recalcula com
 * o dia do VISITANTE. Em qualquer dia (prazo) ou mês (dívida) diferente do
 * build, o texto divergia e o React jogava o erro #418 no console — medido em
 * produção nas duas páginas, com o build de 01/10 em UTC lido às 22h de 30/09
 * em São Paulo.
 *
 * A saída é o `useSyncExternalStore`: durante a hidratação o React usa o valor
 * de servidor (o dia do build, gravado pelo `next.config.ts`), que é idêntico
 * nos dois lados; logo depois troca para o dia local. É uma STRING
 * `AAAA-MM-DD`, e não um timestamp, porque o dia do build lido num fuso
 * negativo voltaria um dia e reabriria a mesma divergência.
 */
const DIA_DO_BUILD = process.env.NEXT_PUBLIC_DIA_DO_BUILD ?? "";

const p2 = (n: number) => String(n).padStart(2, "0");
const diaLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
};
const semAssinatura = () => () => {};

/** O dia de hoje como `AAAA-MM-DD`: o do build na hidratação, o local depois. */
export function useDia(): string {
  return useSyncExternalStore(semAssinatura, diaLocal, () => DIA_DO_BUILD || diaLocal());
}

/** `AAAA-MM-DD` para meia-noite LOCAL. `new Date("2026-09-08")` seria UTC. */
export function deDia(dia: string): Date {
  const [a, m, d] = dia.split("-").map(Number);
  return new Date(a, m - 1, d);
}
