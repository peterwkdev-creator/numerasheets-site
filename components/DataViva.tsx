"use client";

import { useDia } from "@/lib/hoje";
import { deslocar } from "@/lib/datas";

/** Uma data da prévia de planilha no dia de quem abre. Ver `lib/datas.ts`. */
export default function DataViva({ v, gerado }: { v: string; gerado: string }) {
  return <>{deslocar(v, gerado, useDia())}</>;
}
