export const toIso = (
  x: number,
  y: number,
  modX: number = 0,
  modY: number = 0
): [number, number] => {
  const tX = x
  const tY = y
  return [tX - tY + 32 + modX, 32 + modY + (tY + tX) / 2]
}

export const toOrth = (x: number, y: number): [number, number] => {
  return [(2 * y + x) / 2, (2 * y - x) / 2]
}
