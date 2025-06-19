// Parseert "2230-2270" => 2250
export function rangeMidpoint(val: string): number | null {
  const match = val.match(/^(\d+)-(\d+)$/);
  if (!match) return null;
  const [_, a, b] = match;
  return (parseInt(a, 10) + parseInt(b, 10)) / 2;
}
