export function capitalize(str: string) {
  return str.toUpperCase()[0] + str.slice(1);
}

export function calculateApothem(side: number, numSides: number) {
  const apothem = side / (2 * Math.tan(Math.PI / numSides));
  return apothem;
}
