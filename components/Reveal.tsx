"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Revela o filho ao entrar na viewport: sobe alguns pixels e aparece.
 *
 * Por que existe: medido no Linear em 31/08/2026, **1.023 de 5.111 elementos**
 * da home carregam transição ou animação — cerca de 20%. O que faz uma página
 * parecer viva não é vídeo (eles têm zero) nem carrossel; é movimento curto e
 * ligado ao conteúdo.
 *
 * Três armadilhas evitadas de propósito:
 *
 * 1. **Sem JavaScript o conteúdo tem de aparecer.** O estado inicial é
 *    invisível, então o `<noscript>` que força a visibilidade fica no
 *    `layout.tsx` — uma vez só. Dentro do componente ele saía repetido por
 *    instância (dez vezes na home). Sem essa regra, um leitor sem JS veria a
 *    página vazia.
 * 2. **`prefers-reduced-motion` revela na hora**, sem observar nada.
 * 3. **Uma vez revelado, nunca esconde de novo.** Reaparecer ao rolar para
 *    cima é irritante e a pessoa perde o texto que estava lendo.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  /** Escalonamento em ms, para uma grade não subir toda de uma vez. */
  delay?: number;
  as?: "div" | "li" | "section";
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduz) {
      setVisivel(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisivel(true);
          obs.disconnect();
        }
      },
      // Revela um pouco antes de entrar de fato, para o movimento terminar
      // enquanto o elemento ainda sobe na tela.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
        ref={ref as never}
        data-reveal
        style={{ transitionDelay: visivel ? `${delay}ms` : "0ms" }}
        className={[
          "transition-[opacity,transform] duration-[620ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none",
          visivel ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          className,
        ].join(" ")}
    >
      {children}
    </Tag>
  );
}
