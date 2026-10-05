import Image from "next/image";
import Link from "next/link";
import { SHOP_URL } from "@/lib/products";

/**
 * O cabeçalho do site inteiro.
 *
 * Até 05/10/2026 havia cinco cópias: a da home tinha menu, mas `hidden
 * md:flex` e nenhum substituto (no celular, menu nenhum), e as outras quatro
 * eram só o logo. Quem chegava pelo Google numa página de produto ou numa
 * calculadora não tinha como ir a lugar nenhum sem rolar até o rodapé.
 * Ver `Etsy/REVISAO-UX-SITE-2026-10-05.md`, achados 1, 11 e 13.
 *
 * No celular o menu desce para uma segunda linha em vez de virar um botão
 * de menu: são quatro links curtos, e escondê-los atrás de um ícone era o
 * defeito que se queria consertar. Por isso o cabeçalho só gruda no topo a
 * partir de `md`: duas linhas grudadas comeriam um sexto da tela do celular.
 */
const links = [
  { href: "/#templates", label: "Templates" },
  { href: "/#free", label: "Free tools" },
  { href: "/#how", label: "How it works" },
  { href: "/#faq", label: "FAQ" },
];

type Props = {
  /** Destino do "pular para o conteúdo"; cada página dá `id` ao seu `<main>`. */
  skip?: { href: string; label: string };
  /** Só a home carrega o logo com `priority`: é onde ele está acima da dobra no LCP. */
  priority?: boolean;
};

export default function Header({
  skip = { href: "#main", label: "Skip to content" },
  priority = false,
}: Props) {
  return (
    <>
      <a
        href={skip.href}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-btn focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:text-white"
      >
        {skip.label}
      </a>

      <header className="z-40 border-b border-rule/80 bg-white/85 backdrop-blur-md md:sticky md:top-0">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 px-5 sm:px-8">
          <Link href="/" className="flex h-16 items-center gap-2.5">
            <Image
              src="/mark.png"
              alt=""
              aria-hidden
              width={128}
              height={128}
              priority={priority}
              className="h-8 w-8 rounded-[7px]"
            />
            <span className="text-[17px] font-semibold tracking-[-0.02em]">
              NumeraSheets
            </span>
          </Link>

          {/* `min-h-11`: 44 px de alvo de toque. Na revisão de 03/09/2026 estes
              links tinham 22 px, abaixo dos 24 da WCAG 2.2 (2.5.8). */}
          <nav
            aria-label="Main"
            className="order-last -mx-2 flex w-full items-center gap-x-1 overflow-x-auto pb-1 text-[14px] text-ink-soft md:order-none md:mx-0 md:w-auto md:gap-x-6 md:overflow-visible md:pb-0 md:text-[14.5px]"
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex min-h-11 shrink-0 items-center px-2 transition-colors hover:text-ink md:px-0"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <a
            href={SHOP_URL}
            className="inline-flex min-h-11 items-center rounded-btn bg-ink px-4 text-[14px] font-medium text-white transition-colors hover:bg-ink-deep sm:px-5"
          >
            Visit the shop
          </a>
        </div>
      </header>
    </>
  );
}
