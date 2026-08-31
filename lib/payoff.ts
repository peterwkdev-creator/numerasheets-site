/**
 * Snowball × avalanche, mês a mês.
 *
 * É a MESMA mecânica do `build_workbook.py` do Debt Payoff Tracker, portada
 * para TypeScript. Não é aproximação: foi validada contra a planilha depois de
 * o LibreOffice recalcular, com o exemplo de cinco dívidas que vem no produto.
 *
 *   snowball   42 meses, juros 8050,838671  → delta 4,6e-12
 *   avalanche  41 meses, juros 6746,526927  → delta 1,8e-12
 *
 * Se esta função mudar, refazer a comparação. O arquivo vendido é a fonte da
 * verdade; esta é a cópia.
 *
 * A ordem de cada mês, por dívida, na prioridade da estratégia:
 *
 *   juros    = saldo × APR / 12
 *   mínimo   = min(pagamento mínimo, saldo + juros)
 *   extra    = min(sobra do bolso, saldo + juros − mínimo)
 *   saldo'   = max(0, saldo + juros − mínimo − extra)
 *
 * O "bolso" do mês começa em `extra` e recebe o mínimo de toda dívida que já
 * estava zerada no início do mês — é isso que faz a bola de neve crescer.
 */

export type Debt = {
  name: string;
  balance: number;
  /** Taxa anual como fração: 24,99% = 0.2499. */
  apr: number;
  min: number;
};

export type Plan = {
  months: number;
  interest: number;
  paid: number;
  /** Em que mês (1-based) cada dívida zerou, na ordem de entrada. */
  clearedAt: (number | null)[];
  /** Nomes na ordem em que foram quitadas. */
  order: string[];
};

/** Teto de segurança: dívida cujo mínimo não cobre os juros nunca fecharia. */
const MAX_MONTHS = 600;

function simulate(debts: Debt[], extra: number, priority: number[]): Plan {
  const q = priority.map((i) => ({ ...debts[i], idx: i }));
  const clearedAt: (number | null)[] = debts.map(() => null);
  let interest = 0;
  let paid = 0;
  let months = 0;

  for (let m = 0; m < MAX_MONTHS; m++) {
    if (q.every((d) => d.balance <= 0)) break;

    let pool = extra + q.reduce((a, d) => a + (d.balance <= 0 ? d.min : 0), 0);

    for (const d of q) {
      if (d.balance <= 0) continue;
      const juros = (d.balance * d.apr) / 12;
      const minimo = Math.min(d.min, d.balance + juros);
      const extraPay = Math.min(pool, d.balance + juros - minimo);
      pool -= extraPay;
      interest += juros;
      paid += minimo + extraPay;
      d.balance = Math.max(0, d.balance + juros - minimo - extraPay);
      if (d.balance <= 0 && clearedAt[d.idx] === null) clearedAt[d.idx] = m + 1;
    }
    months = m + 1;
  }

  return {
    months,
    interest,
    paid,
    clearedAt,
    order: q.map((d) => d.name),
  };
}

/** Menor saldo primeiro. Empate desfeito pela ordem de entrada. */
export const snowballOrder = (debts: Debt[]) =>
  debts.map((_, i) => i).sort((a, b) => debts[a].balance - debts[b].balance);

/** Maior juro primeiro. Empate desfeito pela ordem de entrada. */
export const avalancheOrder = (debts: Debt[]) =>
  debts.map((_, i) => i).sort((a, b) => debts[b].apr - debts[a].apr);

export type Comparison = {
  snowball: Plan;
  avalanche: Plan;
  /** Positivo quando a avalanche sai mais barata, que é o caso usual. */
  interestSaved: number;
  /** Meses a menos da avalanche. Pode ser 0. */
  monthsSaved: number;
  /**
   * `true` quando alguma dívida não fecha dentro do teto — mínimo menor que os
   * juros. Sem isto a página mostraria "600 meses" como se fosse um resultado.
   */
  neverClears: boolean;
};

export function compare(debts: Debt[], extra: number): Comparison {
  const usable = debts.filter((d) => d.balance > 0);
  const snowball = simulate(usable, extra, snowballOrder(usable));
  const avalanche = simulate(usable, extra, avalancheOrder(usable));
  return {
    snowball,
    avalanche,
    interestSaved: snowball.interest - avalanche.interest,
    monthsSaved: snowball.months - avalanche.months,
    neverClears:
      snowball.months >= MAX_MONTHS || avalanche.months >= MAX_MONTHS,
  };
}

/** Mês 1 é o mês que vem. Rótulo curto, no fuso local de quem abre. */
export function monthLabel(from: Date, monthsAhead: number) {
  const d = new Date(from.getFullYear(), from.getMonth() + monthsAhead, 1);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
