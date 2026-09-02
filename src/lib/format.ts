const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export function formatPreco(valor: number | null, sobConsulta = false) {
  if (sobConsulta || valor === null) return "Sob consulta";
  return brl.format(valor);
}

export function formatArea(m2: number | null) {
  return m2 === null ? "—" : `${m2} m²`;
}

export function formatData(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
