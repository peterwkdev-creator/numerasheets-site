/**
 * A mesma aritmética de datas do Project Management Tracker, em TypeScript.
 *
 * O produto existe por causa de uma regra só, e é esta:
 *
 *     início = o mais TARDE entre o dia planejado
 *              e o dia seguinte ao fim da tarefa de que ele depende
 *
 * É isso que faz o atraso viajar: quando a tarefa 5 estoura, a 8 escorrega, e
 * tudo o que espera pela 8 escorrega junto — até o fim do projeto.
 *
 * ⚠️ **Uma tarefa só pode esperar por uma tarefa ACIMA dela na lista.** Não é
 * preguiça: é a restrição que permite calcular tudo numa passada só, sem
 * resolver um grafo e sem macro. A planilha entregue tem a mesma restrição, e
 * ela está escrita no guia, na licença e no anúncio — esta página não pode
 * prometer mais do que o arquivo faz.
 *
 * Dias são dias de CALENDÁRIO, aqui e no arquivo. Fim de semana conta.
 */

export type Task = {
  name: string;
  /** Índice (base 1) da tarefa de que esta depende. 0 = não espera ninguém. */
  waitsFor: number;
  /** Duração em dias de calendário. Mínimo 1 — uma tarefa de zero dia não existe. */
  days: number;
};

export type Scheduled = Task & {
  index: number;
  start: Date;
  finish: Date;
  /** `true` quando o início foi empurrado pela dependência, não pelo plano. */
  pushed: boolean;
  /** `true` no caminho que define a data de fim do projeto. */
  setsFinish: boolean;
  /** Mensagem pronta, no mesmo espírito da coluna de nota da planilha. */
  note: string;
};

export type Schedule = {
  rows: Scheduled[];
  finish: Date | null;
  /** Dias entre o fim calculado e a data prometida. Negativo = não cabe. */
  slack: number | null;
  /** Índice (base 1) da tarefa que define a data de fim. */
  driver: number | null;
};

const DIA = 86_400_000;

export const addDays = (d: Date, n: number) => new Date(d.getTime() + n * DIA);

/** Diferença em dias inteiros, ignorando hora — as datas aqui são dias, não instantes. */
export const daysBetween = (a: Date, b: Date) =>
  Math.round((meiaNoite(b).getTime() - meiaNoite(a).getTime()) / DIA);

const meiaNoite = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const fmt = (d: Date) =>
  d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

/**
 * Calcula a agenda inteira numa passada.
 *
 * `start` é o dia em que o projeto começa; toda tarefa sem dependência começa
 * nele. (Na planilha cada tarefa tem um "planned start" próprio; aqui a página
 * simplifica para uma entrada só, e o texto da página diz isso.)
 */
export function schedule(tasks: Task[], start: Date, target: Date | null): Schedule {
  const base = meiaNoite(start);
  const rows: Scheduled[] = [];

  tasks.forEach((t, i) => {
    const days = Math.max(1, Math.round(t.days) || 1);

    // Só vale dependência para tarefa ACIMA. Referência para baixo, para si
    // mesma ou para índice inexistente é ignorada -- e a nota diz isso, em vez
    // de calcular errado em silêncio.
    const dep = t.waitsFor >= 1 && t.waitsFor <= i ? rows[t.waitsFor - 1] : null;
    const refInvalida = t.waitsFor !== 0 && !dep;

    const inicioDep = dep ? addDays(dep.finish, 1) : null;
    const inicio = inicioDep && inicioDep > base ? inicioDep : base;
    const fim = addDays(inicio, days - 1);

    rows.push({
      ...t,
      days,
      index: i + 1,
      start: inicio,
      finish: fim,
      pushed: !!inicioDep && inicioDep > base,
      setsFinish: false,
      note: refInvalida
        ? `Waits for a task number that does not exist above it`
        : dep
          ? `Waits on #${dep.index}`
          : "",
    });
  });

  if (!rows.length) return { rows, finish: null, slack: null, driver: null };

  const finish = rows.reduce((a, r) => (r.finish > a ? r.finish : a), rows[0].finish);
  // Empate: a PRIMEIRA que termina no dia do fim é a que se nomeia. Escolher a
  // última seria igualmente arbitrário, e não nomear nenhuma esconde o achado.
  const driver = rows.find((r) => +r.finish === +finish) ?? null;
  if (driver) {
    driver.setsFinish = true;
    driver.note = driver.note
      ? `${driver.note} · sets the finish date`
      : "Sets the finish date";
  }

  return {
    rows,
    finish,
    slack: target ? daysBetween(finish, meiaNoite(target)) : null,
    driver: driver ? driver.index : null,
  };
}
