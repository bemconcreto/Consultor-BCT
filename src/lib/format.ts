// src/lib/format.ts
const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/**
 * Formata um valor numérico como moeda brasileira (R$ 1.234,56).
 * Aceita null/undefined e trata como zero para evitar quebrar a UI.
 */
export function formatBRL(value: number | null | undefined): string {
  const v = typeof value === "number" && !Number.isNaN(value) ? value : 0;
  return brlFormatter.format(v);
}
