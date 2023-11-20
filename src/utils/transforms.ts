export const toIso = (x: number, y: number): [number, number] => {
  const tX = x
  const tY = y
  return [tX - tY + 32, 32 + (tY + tX) / 2]
}

export const toOrth = (x: number, y: number): [number, number] => {
  return [(2 * y + x) / 2, (2 * y - x) / 2]
}
