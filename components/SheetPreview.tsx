import type { CSSProperties } from "react";
import DataViva from "./DataViva";
import { pareceData } from "@/lib/datas";

/**
 * Renderiza uma aba calculada de um dos workbooks como tabela HTML.
 *
 * Os dados vêm de `Products/_shared/export_preview.py`, que manda o LibreOffice
 * **calcular** o `.xlsx` e lê os valores em cache. Nenhum número é escrito à
 * mão aqui nem no JSON — é o que o comprador vê ao abrir o arquivo.
 *
 * A moldura (letra de coluna, número de linha, grade) é desenhada de propósito:
 * sem ela a tabela lê como "uma tabela bonita do site" e o ponto todo é mostrar
 * que existe uma planilha por trás.
 *
 * As DATAS são a única exceção ao "nada é escrito à mão": o exemplo é relativo
 * ao dia da exportação, e cada célula com cara de data anda até o dia de quem
 * abre (`DataViva`, regra em `lib/datas.ts`). O resto é o cache do arquivo.
 */

export type PreviewCell = {
  col: string;
  v: string;
  span?: number;
  b?: boolean;
  sz?: number;
  num?: boolean;
};

export type PreviewData = {
  product: string;
  sheet: string;
  range: string;
  generated: string;
  cols: { letter: string; width: number }[];
  rows: { n: number; cells: PreviewCell[] }[];
};

/** Largura do Excel -> px. Menor no modo compacto, que vive no hero. */
const px = (w: number, compact: boolean) => Math.round(w * (compact ? 5.4 : 7));

/**
 * Largura mínima para o número mais largo da coluna caber.
 *
 * Rede de segurança, não a fonte da largura: a largura certa vem do `.xlsx`.
 * Existe porque em 01/09/2026 a coluna F saiu com 9.0 (um fallback do
 * exportador) em vez de 16.0, e `$42,580.84` vazou para fora da célula no
 * celular -- em silêncio, porque célula numérica é `whitespace-nowrap` e o
 * estouro não quebra layout nenhum, só desenha por cima.
 *
 * Métrica medida na fonte mono do site: 6,3px por caractere a 11,5px, e a
 * mesma proporção a 13px. `pad` acompanha o `px-1.5`/`px-2` das células.
 */
const minPx = (chars: number, compact: boolean) =>
  chars === 0 ? 0 : Math.ceil(chars * (compact ? 6.3 : 7.15)) + (compact ? 13 : 17);

/**
 * A mesma aba sem algumas colunas, para o celular. Um `span` que passava por
 * uma coluna tirada encolhe; célula que só existia nela some. Letra que não
 * está na aba quebra o build: o JSON é regerado e a lista não pode envelhecer
 * em silêncio.
 */
function semColunas(data: PreviewData, fora: string[]): PreviewData {
  const ordem = data.cols.map((c) => c.letter);
  for (const l of fora)
    if (!ordem.includes(l))
      throw new Error(`SheetPreview: coluna ${l} não existe em ${data.range}`);
  return {
    ...data,
    cols: data.cols.filter((c) => !fora.includes(c.letter)),
    rows: data.rows.map((row) => ({
      n: row.n,
      cells: row.cells.flatMap((cell) => {
        const i = ordem.indexOf(cell.col);
        const ficam = ordem
          .slice(i, i + (cell.span ?? 1))
          .filter((l) => !fora.includes(l));
        if (ficam.length === 0) return [];
        return [{ ...cell, col: ficam[0], span: ficam.length > 1 ? ficam.length : undefined }];
      }),
    })),
  };
}

/**
 * Texto seguido só de células vazias passa a ocupá-las (`span` até o fim da
 * linha) e quebra dentro delas. É o transbordo do Excel, com uma diferença:
 * aqui a tabela tem largura fixa, e a frase que passasse dela era cortada pela
 * borda -- na home, a conclusão do Snowball contra Avalanche (05/10/2026).
 * Só o texto que não cabe na própria coluna (`cabe`): juntar células apaga a
 * grade, e um "Hours" curto não tem por que apagá-la.
 */
function comTransbordo(
  data: PreviewData,
  cabe: (cell: PreviewCell) => boolean,
): PreviewData {
  const ordem = data.cols.map((c) => c.letter);
  return {
    ...data,
    rows: data.rows.map((row) => {
      const i = row.cells.findIndex(
        (c, k) =>
          !c.num &&
          !c.span &&
          c.v !== "" &&
          !cabe(c) &&
          k < row.cells.length - 1 &&
          row.cells.slice(k + 1).every((r) => r.v === ""),
      );
      if (i === -1) return row;
      const cell = row.cells[i];
      return {
        n: row.n,
        cells: [
          ...row.cells.slice(0, i),
          { ...cell, span: ordem.length - ordem.indexOf(cell.col) },
        ],
      };
    }),
  };
}

export default function SheetPreview({
  data,
  className = "",
  compact = false,
  caption,
  narrowHide,
}: {
  data: PreviewData;
  className?: string;
  /** Menos altura de linha e tipo menor, para caber no hero. */
  compact?: boolean;
  /** `null` esconde a legenda. Sem passar nada, usa a padrão. */
  caption?: string | null;
  /**
   * Colunas que somem abaixo de `sm` (640px). Para a prévia que precisa caber
   * inteira no celular, sem rolagem; as outras rolam de lado.
   */
  narrowHide?: string[];
}) {
  const estreita = narrowHide ? semColunas(data, narrowHide) : null;

  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-card border border-rule bg-white shadow-[0_18px_40px_-24px_rgba(27,35,51,0.45)]">
        {/* barra de aba, como no rodapé de uma planilha */}
        <div className="flex items-center gap-2 border-b border-rule bg-cool px-3 py-2">
          <span className="inline-block h-2.5 w-2.5 rounded-[3px] bg-gold" />
          <span className="font-mono text-[12px] text-slate">
            {data.sheet}
          </span>
        </div>

        {estreita ? (
          <>
            <div className="sm:hidden">
              <Tabela data={estreita} compact={compact} />
            </div>
            <div className="hidden sm:block">
              <Tabela data={data} compact={compact} />
            </div>
          </>
        ) : (
          <Tabela data={data} compact={compact} />
        )}
      </div>

      {caption === null ? null : (
        <figcaption className="mt-3 text-[13px] text-slate">
          {caption ??
            `The ${data.sheet} tab of the example workbook, exactly as it calculates — every figure read from the file itself, not typed for this page.`}
        </figcaption>
      )}
    </figure>
  );
}

function Tabela({ data: bruta, compact }: { data: PreviewData; compact: boolean }) {
  // Maior número (em caracteres) de cada coluna -- só os numéricos, que são os
  // que não quebram linha. Texto pode transbordar de propósito, como no Excel.
  const maiorNum: Record<string, number> = {};
  for (const row of bruta.rows)
    for (const cell of row.cells)
      if (cell.num && !cell.span)
        maiorNum[cell.col] = Math.max(maiorNum[cell.col] ?? 0, cell.v.length);

  const larg = (c: { letter: string; width: number }) =>
    Math.max(px(c.width, compact), minPx(maiorNum[c.letter] ?? 0, compact));

  const total = bruta.cols.reduce((a, c) => a + larg(c), 0);
  const pad = compact ? "px-1.5 py-[1px]" : "px-2 py-[3px]";
  const escala = compact ? 1.0 : 1.15;
  const rowHdr = compact ? 26 : 34;

  // Largura estimada do texto pela mesma metrica de `minPx` (0,55 em por
  // caractere, mais o padding), contra a largura da coluna em que ele esta.
  const coluna = Object.fromEntries(bruta.cols.map((c) => [c.letter, larg(c)]));
  const data = comTransbordo(bruta, (cell) => {
    const fonte = cell.sz ? Math.round(cell.sz * escala) : compact ? 11.5 : 13;
    return Math.ceil(cell.v.length * fonte * 0.55) + (compact ? 13 : 17) <= coluna[cell.col];
  });

  return (
        <>
        {/*
          `tabIndex`, `role` e `aria-label` existem porque o axe-core acusou
          `scrollable-region-focusable` (impacto "serious") em 08/09/2026: uma
          area com rolagem horizontal e inalcancavel por teclado. A planilha e
          mais larga que o celular, entao ela ROLA -- e sem isto quem navega
          por teclado nao consegue ver as colunas da direita.

          O nome vem da aba da planilha, que e o que o leitor de tela precisa
          para saber de que regiao se trata.
        */}
        <div
          className="overflow-x-auto"
          tabIndex={0}
          role="region"
          aria-label={`${data.sheet} — spreadsheet, scroll sideways to see every column`}
        >
          <table
            className={compact ? "border-collapse text-[11.5px]" : "border-collapse text-[13px]"}
            // `width` explicita, nao `minWidth`: com `table-layout: fixed` e
            // largura `auto`, a especificacao manda cair de volta para o
            // algoritmo automatico -- e a coluna B chegava a 528px em vez de
            // 140, escondendo todas as outras. Medido no DOM.
            // O `max` com 100%: a tabela que cabe sobrando preenche a moldura
            // em vez de deixar uma faixa branca a direita (hero no celular).
            style={{ width: `max(${total + rowHdr}px, 100%)`, tableLayout: "fixed" }}
          >
            <thead>
              <tr>
                <th
                  style={{ width: rowHdr }}
                  className="sticky left-0 z-10 border-b border-r border-rule bg-cool"
                />
                {data.cols.map((c) => (
                  <th
                    key={c.letter}
                    style={{ width: larg(c) }}
                    className="border-b border-r border-rule bg-cool py-1 text-center font-mono text-[11px] font-normal text-slate"
                  >
                    {c.letter}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={row.n}>
                  <td className="sticky left-0 z-10 border-b border-r border-rule bg-cool px-1 text-center font-mono text-[11px] text-slate">
                    {row.n}
                  </td>
                  {row.cells.length === 0 ? (
                    <td
                      colSpan={data.cols.length}
                      className="border-b border-rule"
                      style={{ height: compact ? 16 : 22 }}
                    />
                  ) : (
                    row.cells.map((cell) => {
                      const style: CSSProperties = {};
                      if (cell.sz) style.fontSize = `${Math.round(cell.sz * escala)}px`;
                      const quebra = !cell.num && !!cell.span;
                      return (
                        <td
                          key={cell.col}
                          colSpan={cell.span}
                          style={style}
                          className={[
                            `border-b border-r border-rule ${pad} align-middle`,
                            // Texto com `span` quebra dentro das celulas que
                            // ocupa (ver comTransbordo); o resto e uma linha so.
                            quebra ? "whitespace-normal" : "whitespace-nowrap",
                            cell.num ? "" : "overflow-visible",
                            cell.b ? "font-semibold text-ink" : "text-ink-soft",
                            cell.num ? "text-right font-mono tabular-nums" : "",
                          ].join(" ")}
                        >
                          {cell.num ? (
                            cell.v
                          ) : (
                            <span
                              className={
                                quebra
                                  ? "relative z-[1] block"
                                  : "relative z-[1] block w-max max-w-none"
                              }
                            >
                              {pareceData(cell.v) ? (
                                <DataViva v={cell.v} gerado={data.generated} />
                              ) : (
                                cell.v
                              )}
                            </span>
                          )}
                        </td>
                      );
                    })
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
  );
}
