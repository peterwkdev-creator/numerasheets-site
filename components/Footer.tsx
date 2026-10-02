import Link from "next/link";
import { SHOP_NAME, SHOP_URL } from "@/lib/products";
import { tools } from "@/lib/tools";

/**
 * O rodape do site inteiro.
 *
 * Ate 30/09/2026 so a home tinha rodape: as quinze paginas de produto e as
 * duas calculadoras terminavam na ultima secao, sem caminho de volta para a
 * loja nem para as outras ferramentas. Extraido da home para que as tres
 * familias de pagina mostrem o mesmo.
 *
 * Os links tem 44 px de altura (`min-h-11`): eram 28 px, abaixo do alvo de
 * toque minimo, medido na revisao de 30/09.
 */
export default function Footer() {
  return (
    <footer className="border-t border-rule py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 text-[13.5px] text-slate sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {new Date().getFullYear()} NumeraSheets. Templates are sold and
          delivered through {SHOP_NAME}.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
          {/* Derivado de `lib/tools.ts`: ferramenta nova entra aqui sozinha.
              Pagina orfa nao e indexada -- a calculadora de divida ficou
              assim ate 03/09/2026, no sitemap e sem link interno nenhum. */}
          {tools.map((t) => (
            <Link
              key={t.slug}
              className="inline-flex min-h-11 items-center transition-colors hover:text-ink"
              href={`/tools/${t.slug}`}
            >
              {t.label}
            </Link>
          ))}
          <a
            className="inline-flex min-h-11 items-center transition-colors hover:text-ink"
            href={SHOP_URL}
          >
            {SHOP_URL.replace("https://", "")}
          </a>
        </div>
      </div>
    </footer>
  );
}
