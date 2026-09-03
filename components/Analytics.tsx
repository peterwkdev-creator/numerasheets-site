"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

/**
 * O Vercel Analytics, sem contar as nossas próprias visitas.
 *
 * Medido em 03/09/2026 e é o motivo deste arquivo existir: o painel mostrava
 * **88 visitantes em 30 dias**, e os 88 eram nós. O tráfego começa exatamente
 * no dia em que passamos a mexer no site, só existe nos dias em que mexemos, e
 * **100% das visitas têm referenciador vazio** — automação não manda um.
 *
 * O problema disso não é o número bonito. É que, com ~20 visitas nossas por
 * dia, **o primeiro visitante de verdade passaria despercebido** — e é
 * justamente ele que decide se Pinterest, busca ou anúncio funcionaram.
 *
 * Como marcar um navegador como nosso: abrir o site **uma vez** com
 * `?naomeconte=1`. A visita não é contada e o navegador fica marcado. Serve
 * para o navegador do usuário e para o que a automação dirige.
 */
const CHAVE = "numera-nao-contar";
const MARCA = "naomeconte";

export default function Analytics() {
  return (
    <VercelAnalytics
      beforeSend={(evento) => {
        try {
          if (new URL(evento.url).searchParams.has(MARCA)) {
            localStorage.setItem(CHAVE, "1");
            return null;
          }
          if (localStorage.getItem(CHAVE)) return null;
        } catch {
          // `localStorage` pode lançar (janela anônima, cookies desligados).
          // Na dúvida, CONTAR: deixar de registrar um visitante real é pior
          // do que registrar uma visita nossa.
        }
        return evento;
      }}
    />
  );
}
