"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * A imagem do cartão do catálogo, com a de detalhe aparecendo no hover.
 *
 * Padrão medido na grade da Framer em 31/08/2026: o que faz a grade parecer
 * viva é o próprio produto se mexendo — não vídeo (o Linear tem zero) nem
 * carrossel.
 *
 * **A segunda imagem só é baixada no primeiro hover.** São dez cartões a ~150 KB
 * cada; carregar todas de saída dobraria o peso da página (que hoje é 101 KB) e
 * gastaria banda de quem está no celular, onde hover nem existe. `mounted` só
 * vira `true` quando o cursor entra, e a partir daí a imagem fica.
 *
 * O `alt` da segunda é vazio de propósito: ela é decorativa, mostra o mesmo
 * produto que a primeira já descreveu, e anunciá-la duas vezes ao leitor de
 * tela seria ruído.
 */
export default function CardShot({
  src,
  hoverSrc,
  alt,
}: {
  src: string;
  hoverSrc?: string;
  alt: string;
}) {
  const [mounted, setMounted] = useState(false);

  return (
    <div
      className="relative aspect-square overflow-hidden bg-cool"
      onPointerEnter={(e) => {
        if (e.pointerType !== "touch") setMounted(true);
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={900}
        height={900}
        sizes="(min-width: 1024px) 22rem, (min-width: 640px) 44vw, 90vw"
        className={[
          "h-full w-full object-cover transition-[transform,opacity] duration-300",
          hoverSrc
            ? "group-hover:scale-[1.028] group-hover:opacity-0"
            : "group-hover:scale-[1.028]",
        ].join(" ")}
      />

      {hoverSrc && mounted ? (
        <Image
          src={hoverSrc}
          alt=""
          aria-hidden
          width={900}
          height={900}
          sizes="(min-width: 1024px) 22rem, (min-width: 640px) 44vw, 90vw"
          className="absolute inset-0 h-full w-full scale-[1.028] object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
        />
      ) : null}
    </div>
  );
}
