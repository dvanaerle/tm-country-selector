// Parseert een bereik zoals "2230-2270" en retourneert het afgeronde middelpunt (bijv. 2250)
export function rangeMidpoint(val: string): number | null {
  const match = val.match(/^(\d+)-(\d+)$/);
  if (!match) return null;
  const [_, a, b] = match;
  return Math.round((parseInt(a, 10) + parseInt(b, 10)) / 2);
}
