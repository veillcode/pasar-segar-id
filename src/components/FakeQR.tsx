import { useMemo } from "react";

// Deterministic pseudo QR-style block for visual purposes only.
export function FakeQR({ value, size = 240 }: { value: string; size?: number }) {
  const grid = 29;
  const cells = useMemo(() => {
    // simple hash to seed
    let h = 0;
    for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0;
    const arr: boolean[] = [];
    for (let i = 0; i < grid * grid; i++) {
      h = (h * 1103515245 + 12345) >>> 0;
      arr.push((h & 1) === 1);
    }
    return arr;
  }, [value]);

  const cell = size / grid;
  const finder = (x: number, y: number) => (
    <g key={`f-${x}-${y}`}>
      <rect x={x * cell} y={y * cell} width={7 * cell} height={7 * cell} fill="#111" />
      <rect x={(x + 1) * cell} y={(y + 1) * cell} width={5 * cell} height={5 * cell} fill="#fff" />
      <rect x={(x + 2) * cell} y={(y + 2) * cell} width={3 * cell} height={3 * cell} fill="#111" />
    </g>
  );

  const isFinder = (cx: number, cy: number) =>
    (cx < 8 && cy < 8) || (cx > grid - 9 && cy < 8) || (cx < 8 && cy > grid - 9);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-lg bg-white">
      {cells.map((on, idx) => {
        const cx = idx % grid;
        const cy = Math.floor(idx / grid);
        if (isFinder(cx, cy)) return null;
        if (!on) return null;
        return <rect key={idx} x={cx * cell} y={cy * cell} width={cell} height={cell} fill="#111" />;
      })}
      {finder(0, 0)}
      {finder(grid - 7, 0)}
      {finder(0, grid - 7)}
      <rect x={size / 2 - 22} y={size / 2 - 22} width={44} height={44} rx={8} fill="#fff" />
      <text x={size / 2} y={size / 2 + 5} fontSize="11" fontWeight="700" textAnchor="middle" fill="#111">QRIS</text>
    </svg>
  );
}
