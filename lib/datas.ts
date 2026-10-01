/**
 * Uma data da prévia de planilha, trazida para o dia de quem abre.
 *
 * O JSON da prévia é o workbook calculado no dia em que foi exportado
 * (`generated`), e os dois exemplos com data são RELATIVOS a esse dia: a dívida
 * começa em `StartMonth` (o mês do build) e o projeto começa três semanas
 * antes da segunda-feira do build. Exportado em 01/09, o arquivo dizia "Feb
 * 2030" para sempre, enquanto a calculadora ao lado contava a partir de hoje
 * -- dois números para a mesma dívida na mesma página (revisão de 30/09/2026).
 *
 * O deslocamento é EXATO, não aproximado: nenhum valor dos dois exemplos
 * depende do calendário, só da contagem a partir do início. Por isso:
 *
 * - "Mmm AAAA" anda o número de meses entre o mês de `generated` e o de hoje;
 * - "Mmm D, AAAA" anda semanas inteiras entre as duas segundas-feiras, que é
 *   como o projeto exemplo se ancora (dia útil cai no mesmo dia da semana).
 *
 * Qualquer outro texto passa intacto. O "hoje" vem de `useDia`, que devolve o
 * dia do build durante a hidratação -- sem ele, o erro #418 voltaria.
 */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MES_ANO = /^([A-Z][a-z]{2}) (\d{4})$/;
const DIA_MES_ANO = /^([A-Z][a-z]{2}) (\d{1,2}), (\d{4})$/;
const DIA_MS = 86_400_000;

/** `AAAA-MM-DD` para meia-noite local. Cópia do `deDia` de `lib/hoje.ts`, que
 *  não pode ser importado daqui: ele puxa um hook, e este módulo roda no
 *  componente de servidor `SheetPreview`. */
const deDia = (dia: string) => {
  const [a, m, d] = dia.split("-").map(Number);
  return new Date(a, m - 1, d);
};

const segunda = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7));

export function deslocar(v: string, gerado: string, hoje: string): string {
  const g = deDia(gerado);
  const h = deDia(hoje);
  let m = MES_ANO.exec(v);
  if (m && MONTHS.includes(m[1])) {
    const months = (h.getFullYear() - g.getFullYear()) * 12 + h.getMonth() - g.getMonth();
    const d = new Date(Number(m[2]), MONTHS.indexOf(m[1]) + months, 1);
    return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  }
  m = DIA_MES_ANO.exec(v);
  if (m && MONTHS.includes(m[1])) {
    const semanas = Math.round((segunda(h).getTime() - segunda(g).getTime()) / (7 * DIA_MS));
    const d = new Date(Number(m[3]), MONTHS.indexOf(m[1]), Number(m[2]) + semanas * 7);
    return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }
  return v;
}

/** Só as células com cara de data viram componente de cliente. */
export const pareceData = (v: string) => MES_ANO.test(v) || DIA_MES_ANO.test(v);
