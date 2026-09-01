import type { CSSProperties } from "react";

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

export default function SheetPreview({
  data,
  className = "",
  compact = false,
  caption,
}: {
  data: PreviewData;
  className?: string;
  /** Menos altura de linha e tipo menor, para caber no hero. */
  compact?: boolean;
  /** `null` esconde a legenda. Sem passar nada, usa a padrão. */
  caption?: string | null;
}) {
  const total = data.cols.reduce((a, c) => a + px(c.width, compact), 0);
  const pad = compact ? "px-1.5 py-[1px]" : "px-2 py-[3px]";
  const escala = compact ? 1.0 : 1.15;
  const rowHdr = compact ? 26 : 34;

  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-xl border border-rule bg-white shadow-[0_18px_40px_-24px_rgba(27,35,51,0.45)]">
        {/* barra de aba, como no rodapé de uma planilha */}
        <div className="flex items-center gap-2 border-b border-rule bg-cool px-3 py-2">
          <span className="inline-block h-2.5 w-2.5 rounded-[3px] bg-gold" />
          <span className="font-mono text-[12px] text-slate">
            {data.sheet}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table
            className={compact ? "border-collapse text-[11.5px]" : "border-collapse text-[13px]"}
            // `width` explicita, nao `minWidth`: com `table-layout: fixed` e
            // largura `auto`, a especificacao manda cair de volta para o
            // algoritmo automatico -- e a coluna B chegava a 528px em vez de
            // 140, escondendo todas as outras. Medido no DOM.
            style={{ width: total + rowHdr, tableLayout: "fixed" }}
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
                    style={{ width: px(c.width, compact) }}
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
                      return (
                        <td
                          key={cell.col}
                          colSpan={cell.span}
                          style={style}
                          className={[
                            `whitespace-nowrap border-b border-r border-rule ${pad} align-middle`,
                            cell.num ? "" : "overflow-visible",
                            cell.b ? "font-semibold text-ink" : "text-ink-soft",
                            cell.num ? "text-right font-mono tabular-nums" : "",
                          ].join(" ")}
                        >
                          {cell.num ? (
                            cell.v
                          ) : (
                            <span className="relative z-[1] block w-max max-w-none">
                              {cell.v}
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
